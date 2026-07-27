using Microsoft.EntityFrameworkCore;
using Project_Manager.Application.Services;
using Project_Manager.Infrastructure.AI;
using Project_Manager.Infrastructure.Data;
using Project_Manager.Infrastructure.Repositories;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Add OpenAPI/Swagger
builder.Services.AddOpenApi();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // React default ports
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Configure DbContext with SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Repositories
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// Register Services
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();

// Register Memory Cache for AI
builder.Services.AddMemoryCache();

// Register AI Services
builder.Services.AddHttpClient<IBionicService, BionicService>();
builder.Services.AddScoped<ITaskAnalysisCacheService, TaskAnalysisCacheService>();
builder.Services.AddScoped<ITaskAnalysisService, TaskAnalysisService>();

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    DatabaseSeeder.SeedDatabase(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.MapOpenApi();         // Map OpenAPI endpoint
    app.MapScalarApiReference(); // Add Scalar UI
}

// app.UseHttpsRedirection(); // Disabled for HTTP-only development

app.UseCors("AllowReactApp"); // Enable CORS

app.UseAuthorization();

app.MapControllers();

app.Run();
