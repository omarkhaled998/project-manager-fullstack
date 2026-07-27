using Project_Manager.Domain.Enums;

namespace Project_Manager.Application.DTOs;

public class TaskAnalysisResponse
{
    public List<string> SuggestedTags { get; set; } = new();
    public TaskPriority AiSuggestedPriority { get; set; }
    public string AiTimeEstimate { get; set; } = string.Empty; // e.g., "2-4 hours", "1-2 days"
    public string Reasoning { get; set; } = string.Empty;
}
