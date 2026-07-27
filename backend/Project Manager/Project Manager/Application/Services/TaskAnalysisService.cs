using System.Text.Json;
using Project_Manager.Application.DTOs;
using Project_Manager.Domain.Enums;
using Project_Manager.Infrastructure.AI;

namespace Project_Manager.Application.Services;

public class TaskAnalysisService : ITaskAnalysisService
{
    private readonly IBionicService _bionicService;
    private readonly ITaskAnalysisCacheService _cacheService;
    private readonly ILogger<TaskAnalysisService> _logger;

    public TaskAnalysisService(
        IBionicService bionicService, 
        ITaskAnalysisCacheService cacheService,
        ILogger<TaskAnalysisService> logger)
    {
        _bionicService = bionicService;
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<TaskAnalysisResponse> AnalyzeTaskAsync(TaskAnalysisRequest request)
    {
        // Check cache first
        var cachedResult = _cacheService.GetCachedAnalysis(request.Title, request.Description);
        if (cachedResult != null)
        {
            _logger.LogInformation("Returning cached AI analysis for: {Title}", request.Title);
            return cachedResult;
        }

        // Cache miss - call AI
        var prompt = BuildPrompt(request);

        try
        {
            var aiResponse = await _bionicService.GenerateAsync(prompt);
            _logger.LogInformation("Received AI response: {Response}", aiResponse);

            var result = ParseResponse(aiResponse, request);

            // Cache the result
            _cacheService.CacheAnalysis(request.Title, request.Description, result);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing task with AI");

            // Return fallback response
            return new TaskAnalysisResponse
            {
                SuggestedTags = ExtractKeywords(request.Title + " " + request.Description),
                AiSuggestedPriority = request.UserSetPriority,
                AiTimeEstimate = "Unable to estimate",
                Reasoning = "AI service unavailable. Showing fallback suggestions based on keywords."
            };
        }
    }

    private string BuildPrompt(TaskAnalysisRequest request)
    {
        var priorityName = request.UserSetPriority switch
        {
            TaskPriority.Low => "Low",
            TaskPriority.Medium => "Medium",
            TaskPriority.High => "High",
            _ => "Unknown"
        };

        var dueDateText = request.DueDate.HasValue 
            ? request.DueDate.Value.ToString("yyyy-MM-dd") 
            : "Not set";

        return $@"Analyze this task and provide recommendations in JSON format.

Task Details:
- Title: {request.Title}
- Description: {request.Description ?? "No description"}
- User Set Priority: {priorityName}
- Due Date: {dueDateText}

Based on the task title and description, provide:
1. Relevant tags (2-5 tags, e.g., backend, frontend, bug, feature, urgent, documentation)
2. Your suggested priority (0=Low, 1=Medium, 2=High) - may differ from user's choice if you think it should be different
3. Estimated time to complete (e.g., ""2-4 hours"", ""1-2 days"", ""3-5 days"")
4. Brief reasoning for your suggestions

Respond ONLY with valid JSON in this exact format:
{{
  ""tags"": [""tag1"", ""tag2"", ""tag3""],
  ""suggestedPriority"": 1,
  ""timeEstimate"": ""2-4 hours"",
  ""reasoning"": ""Your explanation here""
}}";
    }

    private TaskAnalysisResponse ParseResponse(string aiResponse, TaskAnalysisRequest originalRequest)
    {
        try
        {
            // Try to extract JSON from the response
            var jsonStart = aiResponse.IndexOf('{');
            var jsonEnd = aiResponse.LastIndexOf('}') + 1;

            if (jsonStart >= 0 && jsonEnd > jsonStart)
            {
                var jsonString = aiResponse.Substring(jsonStart, jsonEnd - jsonStart);

                var aiData = JsonSerializer.Deserialize<AiAnalysisResult>(jsonString, new JsonSerializerOptions 
                { 
                    PropertyNameCaseInsensitive = true 
                });

                if (aiData != null)
                {
                    // Validate priority is in valid range
                    var priority = aiData.SuggestedPriority >= 0 && aiData.SuggestedPriority <= 2
                        ? (TaskPriority)aiData.SuggestedPriority
                        : TaskPriority.Medium;

                    return new TaskAnalysisResponse
                    {
                        SuggestedTags = aiData.Tags ?? new List<string>(),
                        AiSuggestedPriority = priority,
                        AiTimeEstimate = aiData.TimeEstimate ?? "Unknown",
                        Reasoning = aiData.Reasoning ?? "No reasoning provided"
                    };
                }
            }

            _logger.LogWarning("Could not parse JSON from AI response: {Response}", aiResponse);
            throw new JsonException("Invalid JSON format in AI response");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse AI response. Using fallback.");

            // Fallback: extract basic info
            return new TaskAnalysisResponse
            {
                SuggestedTags = ExtractKeywords(originalRequest.Title + " " + originalRequest.Description),
                AiSuggestedPriority = originalRequest.UserSetPriority,
                AiTimeEstimate = "Unable to estimate - parsing failed",
                Reasoning = "AI response could not be parsed. Using keyword extraction as fallback."
            };
        }
    }

    private List<string> ExtractKeywords(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return new List<string>();

        var lowerText = text.ToLower();
        var keywords = new List<string>();

        // Common project management keywords
        if (lowerText.Contains("bug") || lowerText.Contains("fix")) keywords.Add("bug");
        if (lowerText.Contains("feature") || lowerText.Contains("add")) keywords.Add("feature");
        if (lowerText.Contains("test")) keywords.Add("testing");
        if (lowerText.Contains("doc")) keywords.Add("documentation");
        if (lowerText.Contains("api") || lowerText.Contains("endpoint")) keywords.Add("backend");
        if (lowerText.Contains("ui") || lowerText.Contains("frontend")) keywords.Add("frontend");
        if (lowerText.Contains("database") || lowerText.Contains("sql")) keywords.Add("database");
        if (lowerText.Contains("urgent") || lowerText.Contains("critical")) keywords.Add("urgent");
        if (lowerText.Contains("refactor") || lowerText.Contains("improve")) keywords.Add("refactoring");

        return keywords.Take(5).ToList();
    }

    private class AiAnalysisResult
    {
        public List<string>? Tags { get; set; }
        public int SuggestedPriority { get; set; }
        public string? TimeEstimate { get; set; }
        public string? Reasoning { get; set; }
    }
}
