using Microsoft.EntityFrameworkCore;
using Project_Manager.Domain.Entities;
using Project_Manager.Domain.Enums;

namespace Project_Manager.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static void SeedDatabase(ApplicationDbContext context)
    {
        // Automatically create database and tables (simpler than migrations for development)
        context.Database.EnsureCreated();

        if (context.Projects.Any())
        {
            return; // Database already seeded
        }

        var project1 = new Project
        {
            Name = "Website Redesign",
            Description = "Redesign company website with modern UI/UX",
            CreatedAt = DateTime.UtcNow.AddDays(-30)
        };

        var project2 = new Project
        {
            Name = "Mobile App Development",
            Description = "Build cross-platform mobile application",
            CreatedAt = DateTime.UtcNow.AddDays(-20)
        };

        context.Projects.AddRange(project1, project2);
        context.SaveChanges();

        var tasks = new List<TaskItem>
        {
            new TaskItem
            {
                ProjectId = project1.Id,
                Title = "Design mockups",
                Description = "Create wireframes and visual mockups for all pages",
                Status = TaskItemStatus.Done,
                Priority = TaskPriority.High,
                DueDate = DateTime.UtcNow.AddDays(-15),
                CreatedAt = DateTime.UtcNow.AddDays(-28)
            },
            new TaskItem
            {
                ProjectId = project1.Id,
                Title = "Implement homepage",
                Description = "Code the new homepage with responsive design",
                Status = TaskItemStatus.InProgress,
                Priority = TaskPriority.High,
                DueDate = DateTime.UtcNow.AddDays(5),
                CreatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new TaskItem
            {
                ProjectId = project2.Id,
                Title = "Setup development environment",
                Description = "Configure React Native and required dependencies",
                Status = TaskItemStatus.Done,
                Priority = TaskPriority.Medium,
                DueDate = DateTime.UtcNow.AddDays(-10),
                CreatedAt = DateTime.UtcNow.AddDays(-18)
            },
            new TaskItem
            {
                ProjectId = project2.Id,
                Title = "Design app architecture",
                Description = "Plan app structure, state management, and API integration",
                Status = TaskItemStatus.ToDo,
                Priority = TaskPriority.High,
                DueDate = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            }
        };

        context.TaskItems.AddRange(tasks);
        context.SaveChanges();
    }
}
