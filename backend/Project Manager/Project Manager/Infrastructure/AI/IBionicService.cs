namespace Project_Manager.Infrastructure.AI;

public interface IBionicService
{
    Task<string> GenerateAsync(string prompt);
}
