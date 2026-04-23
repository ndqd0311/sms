using Application.Common.Interfaces.Authentication;
using Domain.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data;

public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();

        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser(
    ILogger<ApplicationDbContextInitialiser> logger, 
    ApplicationDbContext context,
    IPasswordHasher passwordHasher)
{
    public async Task InitialiseAsync()
    {
        try
        {
            await context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        // Default roles (Handled by HasData in RoleConfiguration, but let's double check if needed)
        // If RoleConfiguration has HasData, MigrateAsync() already handled it.

        // Default admin user
        var adminEmail = "admin@system.com";
        var administrator = new Teacher 
        { 
            FullName = "System Admin", 
            Email = adminEmail,
            PasswordHash = passwordHasher.HashPassword("Admin123!"),
            RoleId = 2 // Admin
        };

        if (context.Teachers.All(t => t.Email != administrator.Email))
        {
            context.Teachers.Add(administrator);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded default admin user: {Email}", adminEmail);
        }
    }
}
