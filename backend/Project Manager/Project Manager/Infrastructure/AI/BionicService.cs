using System.Text;
using System.Text.Json;

namespace Project_Manager.Infrastructure.AI;

public class BionicService : IBionicService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<BionicService> _logger;
    private readonly string _bionicUrl;
    private readonly string _modelName;

    public BionicService(HttpClient httpClient, ILogger<BionicService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        // Default to Bionic's typical endpoint, configurable via appsettings
        _bionicUrl = configuration.GetValue<string>("Bionic:Url") ?? "http://localhost:1234/v1/chat/completions";
        _modelName = configuration.GetValue<string>("Bionic:Model") ?? string.Empty;

        _logger.LogInformation("BionicService configured with URL: {Url}, Model: {Model}", 
            _bionicUrl, string.IsNullOrEmpty(_modelName) ? "(auto)" : _modelName);
    }

    public async Task<string> GenerateAsync(string prompt)
    {
        try
        {
            // Build request - include model if configured
            var requestObj = new Dictionary<string, object>
            {
                { "messages", new[]
                    {
                        new { role = "system", content = "You are a helpful project management assistant that analyzes tasks and provides structured recommendations." },
                        new { role = "user", content = prompt }
                    }
                },
                { "temperature", 0.7 },
                { "max_tokens", 500 }
            };

            // Only add model parameter if configured
            if (!string.IsNullOrEmpty(_modelName))
            {
                requestObj["model"] = _modelName;
            }

            var json = JsonSerializer.Serialize(requestObj);
            _logger.LogInformation("Sending request to Bionic API at {Url}", _bionicUrl);
            _logger.LogDebug("Request body: {Json}", json);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_bionicUrl, content);

            var responseBody = await response.Content.ReadAsStringAsync();
            _logger.LogDebug("Response status: {Status}, Body: {Body}", response.StatusCode, responseBody);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Bionic API returned error {Status}: {Body}", response.StatusCode, responseBody);
                throw new HttpRequestException($"Bionic returned {response.StatusCode}: {responseBody}");
            }

            var result = JsonSerializer.Deserialize<BionicResponse>(responseBody, new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true 
            });

            var generatedText = result?.Choices?[0]?.Message?.Content ?? string.Empty;
            _logger.LogInformation("Received AI response: {Preview}...", 
                generatedText.Length > 100 ? generatedText.Substring(0, 100) : generatedText);

            return generatedText;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error calling Bionic API. Is Bionic running on {Url}?", _bionicUrl);
            throw new Exception($"Bionic AI service is not available at {_bionicUrl}. Please ensure it's running.", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Bionic API");
            throw new Exception("Failed to get AI response from Bionic.", ex);
        }
    }

    private class BionicResponse
    {
        public List<Choice>? Choices { get; set; }
    }

    private class Choice
    {
        public Message? Message { get; set; }
    }

    private class Message
    {
        public string Content { get; set; } = string.Empty;
    }
}
