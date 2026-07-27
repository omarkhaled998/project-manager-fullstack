using Project_Manager.Application.DTOs;

namespace Project_Manager.Application.Services;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllProjectsAsync();
    Task<ProjectDto?> GetProjectByIdAsync(int id);
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto createDto);
    Task<ProjectDto?> UpdateProjectAsync(int id, UpdateProjectDto updateDto);
    Task<bool> DeleteProjectAsync(int id);
}
