using Microsoft.Extensions.Caching.Memory;
using Project_Manager.Application.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace Project_Manager.Application.Services;

public interface ITaskAnalysisCacheService
{
    TaskAnalysisResponse? GetCachedAnalysis(string title, string? description);
    void CacheAnalysis(string title, string? description, TaskAnalysisResponse response);
    string GetCacheKey(string title, string? description);
}

public class TaskAnalysisCacheService : ITaskAnalysisCacheService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<TaskAnalysisCacheService> _logger;
    private readonly TimeSpan _cacheExpiration;

    public TaskAnalysisCacheService(
        IMemoryCache cache, 
        ILogger<TaskAnalysisCacheService> logger,
        IConfiguration configuration)
    {
        _cache = cache;
        _logger = logger;

        // Default to 1 hour, configurable in appsettings
        var expirationMinutes = configuration.GetValue<int?>("AiCache:ExpirationMinutes") ?? 60;
        _cacheExpiration = TimeSpan.FromMinutes(expirationMinutes);

        _logger.LogInformation("AI Analysis Cache configured with {Minutes} minute expiration", expirationMinutes);
    }

    public TaskAnalysisResponse? GetCachedAnalysis(string title, string? description)
    {
        var cacheKey = GetCacheKey(title, description);

        if (_cache.TryGetValue(cacheKey, out TaskAnalysisResponse? cachedResponse))
        {
            _logger.LogInformation("Cache HIT for task: {Title}", title);
            return cachedResponse;
        }

        _logger.LogInformation("Cache MISS for task: {Title}", title);
        return null;
    }

    public void CacheAnalysis(string title, string? description, TaskAnalysisResponse response)
    {
        var cacheKey = GetCacheKey(title, description);

        var cacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = _cacheExpiration,
            SlidingExpiration = TimeSpan.FromMinutes(_cacheExpiration.TotalMinutes / 2)
        };

        _cache.Set(cacheKey, response, cacheOptions);
        _logger.LogInformation("Cached AI analysis for task: {Title} (expires in {Minutes} minutes)", 
            title, _cacheExpiration.TotalMinutes);
    }

    public string GetCacheKey(string title, string? description)
    {
        // Create fingerprint: title + description (normalized)
        var input = $"{title?.Trim().ToLowerInvariant()}|{description?.Trim().ToLowerInvariant() ?? ""}";

        // Generate SHA256 hash for consistent key
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
        var hash = Convert.ToBase64String(hashBytes);

        return $"ai-analysis:{hash}";
    }
}
