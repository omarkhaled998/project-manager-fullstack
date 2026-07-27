using Project_Manager.Application.DTOs;
using Project_Manager.Domain.Entities;
using Project_Manager.Infrastructure.Repositories;

namespace Project_Manager.Application.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;

    public ProjectService(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllProjectsAsync()
    {
        var projects = await _projectRepository.GetAllAsync();
        return projects.Select(MapToDto);
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(int id)
    {
        var project = await _projectRepository.GetByIdAsync(id);
        return project == null ? null : MapToDto(project);
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto createDto)
    {
        var project = new Project
        {
            Name = createDto.Name,
            Description = createDto.Description,
            CreatedAt = DateTime.UtcNow
        };

        var createdProject = await _projectRepository.CreateAsync(project);
        return MapToDto(createdProject);
    }

    public async Task<ProjectDto?> UpdateProjectAsync(int id, UpdateProjectDto updateDto)
    {
        var existingProject = await _projectRepository.GetByIdAsync(id);
        if (existingProject == null)
        {
            return null;
        }

        existingProject.Name = updateDto.Name;
        existingProject.Description = updateDto.Description;

        var updatedProject = await _projectRepository.UpdateAsync(existingProject);
        return updatedProject == null ? null : MapToDto(updatedProject);
    }

    public async Task<bool> DeleteProjectAsync(int id)
    {
        return await _projectRepository.DeleteAsync(id);
    }

    private static ProjectDto MapToDto(Project project)
    {
        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            Tasks = project.Tasks.Select(t => new TaskItemDto
            {
                Id = t.Id,
                ProjectId = t.ProjectId,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt,
                ProjectName = project.Name
            }).ToList()
        };
    }
}
