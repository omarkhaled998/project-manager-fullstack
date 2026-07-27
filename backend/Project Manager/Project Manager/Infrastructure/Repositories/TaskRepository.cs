using Microsoft.EntityFrameworkCore;
using Project_Manager.Domain.Entities;
using Project_Manager.Infrastructure.Data;

namespace Project_Manager.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly ApplicationDbContext _context;

    public TaskRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItem>> GetAllAsync()
    {
        return await _context.TaskItems
            .Include(t => t.Project)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetByProjectIdAsync(int projectId)
    {
        return await _context.TaskItems
            .Include(t => t.Project)
            .Where(t => t.ProjectId == projectId)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetByIdAsync(int id)
    {
        return await _context.TaskItems
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<TaskItem> CreateAsync(TaskItem taskItem)
    {
        _context.TaskItems.Add(taskItem);
        await _context.SaveChangesAsync();
        return taskItem;
    }

    public async Task<TaskItem?> UpdateAsync(TaskItem taskItem)
    {
        var existingTask = await _context.TaskItems.FindAsync(taskItem.Id);
        if (existingTask == null)
        {
            return null;
        }

        _context.Entry(existingTask).CurrentValues.SetValues(taskItem);
        await _context.SaveChangesAsync();
        return existingTask;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var taskItem = await _context.TaskItems.FindAsync(id);
        if (taskItem == null)
        {
            return false;
        }

        _context.TaskItems.Remove(taskItem);
        await _context.SaveChangesAsync();
        return true;
    }
}
