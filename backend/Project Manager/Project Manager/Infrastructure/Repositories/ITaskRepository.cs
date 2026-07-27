using Project_Manager.Domain.Entities;

namespace Project_Manager.Infrastructure.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetAllAsync();
    Task<IEnumerable<TaskItem>> GetByProjectIdAsync(int projectId);
    Task<TaskItem?> GetByIdAsync(int id);
    Task<TaskItem> CreateAsync(TaskItem taskItem);
    Task<TaskItem?> UpdateAsync(TaskItem taskItem);
    Task<bool> DeleteAsync(int id);
}
