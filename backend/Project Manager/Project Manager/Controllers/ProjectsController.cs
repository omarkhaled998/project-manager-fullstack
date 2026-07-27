using Microsoft.AspNetCore.Mvc;
using Project_Manager.Application.DTOs;
using Project_Manager.Application.Services;

namespace Project_Manager.Controllers;

/// <summary>
/// Manages project operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    /// <summary>
    /// Gets all projects with their tasks
    /// </summary>
    /// <returns>List of all projects</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAll()
    {
        var projects = await _projectService.GetAllProjectsAsync();
        return Ok(projects);
    }

    /// <summary>
    /// Gets a specific project by ID
    /// </summary>
    /// <param name="id">Project ID</param>
    /// <returns>The requested project</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectDto>> GetById(int id)
    {
        var project = await _projectService.GetProjectByIdAsync(id);
        if (project == null)
        {
            return NotFound();
        }
        return Ok(project);
    }

    /// <summary>
    /// Creates a new project
    /// </summary>
    /// <param name="createDto">Project data</param>
    /// <returns>The created project</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProjectDto>> Create([FromBody] CreateProjectDto createDto)
    {
        var project = await _projectService.CreateProjectAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    /// <summary>
    /// Updates an existing project
    /// </summary>
    /// <param name="id">Project ID</param>
    /// <param name="updateDto">Updated project data</param>
    /// <returns>The updated project</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectDto>> Update(int id, [FromBody] UpdateProjectDto updateDto)
    {
        var project = await _projectService.UpdateProjectAsync(id, updateDto);
        if (project == null)
        {
            return NotFound();
        }
        return Ok(project);
    }

    /// <summary>
    /// Deletes a project and all its tasks
    /// </summary>
    /// <param name="id">Project ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _projectService.DeleteProjectAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
