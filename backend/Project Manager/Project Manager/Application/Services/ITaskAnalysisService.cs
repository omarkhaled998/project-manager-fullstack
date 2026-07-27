using Project_Manager.Application.DTOs;

namespace Project_Manager.Application.Services;

public interface ITaskAnalysisService
{
    Task<TaskAnalysisResponse> AnalyzeTaskAsync(TaskAnalysisRequest request);
}
