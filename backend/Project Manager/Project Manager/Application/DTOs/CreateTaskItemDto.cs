using Project_Manager.Domain.Enums;

namespace Project_Manager.Application.DTOs;

public class CreateTaskItemDto
{
    public int ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskItemStatus Status { get; set; }
    public TaskPriority Priority { get; set; }
    public DateTime? DueDate { get; set; }
}
