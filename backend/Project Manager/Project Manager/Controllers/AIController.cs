using Microsoft.AspNetCore.Mvc;
using Project_Manager.Application.DTOs;
using Project_Manager.Application.Services;

namespace Project_Manager.Controllers;

/// <summary>
/// AI-powered task analysis using Bionic
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AIController : ControllerBase
{
    private readonly ITaskAnalysisService _analysisService;
    private readonly ILogger<AIController> _logger;

    public AIController(ITaskAnalysisService analysisService, ILogger<AIController> logger)
    {
        _analysisService = analysisService;
        _logger = logger;
    }

    /// <summary>
    /// Analyzes a task using Bionic AI and provides suggestions
    /// </summary>
    /// <param name="request">Task details to analyze</param>
    /// <returns>AI-generated tags, priority suggestion, and time estimate</returns>
    [HttpPost("analyze-task")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<TaskAnalysisResponse>> AnalyzeTask([FromBody] TaskAnalysisRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new { error = "Task title is required" });
        }

        try
        {
            _logger.LogInformation("Analyzing task: {Title}", request.Title);
            var result = await _analysisService.AnalyzeTaskAsync(request);

            // Check if this is a fallback response (AI service was unavailable)
            if (result.Reasoning?.Contains("AI service unavailable") == true)
            {
                _logger.LogWarning("Returning fallback analysis due to AI service unavailability");
                return Ok(result); // Return 200 with fallback data instead of error
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing task");
            return StatusCode(503, new 
            { 
                error = "AI service is currently unavailable",
                details = ex.Message
            });
        }
    }
}
