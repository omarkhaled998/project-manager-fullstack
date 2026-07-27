using Project_Manager.Application.DTOs;
using Project_Manager.Domain.Entities;
using Project_Manager.Infrastructure.Repositories;

namespace Project_Manager.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<IEnumerable<TaskItemDto>> GetAllTasksAsync()
    {
        var tasks = await _taskRepository.GetAllAsync();
        return tasks.Select(MapToDto);
    }

    public async Task<IEnumerable<TaskItemDto>> GetTasksByProjectIdAsync(int projectId)
    {
        var tasks = await _taskRepository.GetByProjectIdAsync(projectId);
        return tasks.Select(MapToDto);
    }

    public async Task<TaskItemDto?> GetTaskByIdAsync(int id)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        return task == null ? null : MapToDto(task);
    }

    public async Task<TaskItemDto> CreateTaskAsync(CreateTaskItemDto createDto)
    {
        var taskItem = new TaskItem
        {
            ProjectId = createDto.ProjectId,
            Title = createDto.Title,
            Description = createDto.Description,
            Status = createDto.Status,
            Priority = createDto.Priority,
            DueDate = createDto.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        var createdTask = await _taskRepository.CreateAsync(taskItem);
        return MapToDto(createdTask);
    }

    public async Task<TaskItemDto?> UpdateTaskAsync(int id, UpdateTaskItemDto updateDto)
    {
        var existingTask = await _taskRepository.GetByIdAsync(id);
        if (existingTask == null)
        {
            return null;
        }

        existingTask.ProjectId = updateDto.ProjectId;
        existingTask.Title = updateDto.Title;
        existingTask.Description = updateDto.Description;
        existingTask.Status = updateDto.Status;
        existingTask.Priority = updateDto.Priority;
        existingTask.DueDate = updateDto.DueDate;

        var updatedTask = await _taskRepository.UpdateAsync(existingTask);
        return updatedTask == null ? null : MapToDto(updatedTask);
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        return await _taskRepository.DeleteAsync(id);
    }

    private static TaskItemDto MapToDto(TaskItem taskItem)
    {
        return new TaskItemDto
        {
            Id = taskItem.Id,
            ProjectId = taskItem.ProjectId,
            Title = taskItem.Title,
            Description = taskItem.Description,
            Status = taskItem.Status,
            Priority = taskItem.Priority,
            DueDate = taskItem.DueDate,
            CreatedAt = taskItem.CreatedAt,
            ProjectName = taskItem.Project?.Name ?? string.Empty
        };
    }
}
