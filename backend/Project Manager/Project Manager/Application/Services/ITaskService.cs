using Project_Manager.Application.DTOs;

namespace Project_Manager.Application.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItemDto>> GetAllTasksAsync();
    Task<IEnumerable<TaskItemDto>> GetTasksByProjectIdAsync(int projectId);
    Task<TaskItemDto?> GetTaskByIdAsync(int id);
    Task<TaskItemDto> CreateTaskAsync(CreateTaskItemDto createDto);
    Task<TaskItemDto?> UpdateTaskAsync(int id, UpdateTaskItemDto updateDto);
    Task<bool> DeleteTaskAsync(int id);
}
