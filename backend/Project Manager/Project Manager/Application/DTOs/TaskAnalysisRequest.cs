using Project_Manager.Domain.Enums;

namespace Project_Manager.Application.DTOs;

public class TaskAnalysisRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskPriority UserSetPriority { get; set; }
    public DateTime? DueDate { get; set; }
}
