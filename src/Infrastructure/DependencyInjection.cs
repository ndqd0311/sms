using Application.Common.Interfaces;
using Application.Common.Interfaces.Authentication;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Data.Interceptors;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
    {
        string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        Guard.Against.Null(connectionString, message: "Connection string not found.");

        // Handle Render's postgres:// format
        if (connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
        {
            var databaseUri = new Uri(connectionString);
            var userInfo = databaseUri.UserInfo.Split(':');

            connectionString = $"Host={databaseUri.Host};" +
                               $"Port={databaseUri.Port};" +
                               $"Database={databaseUri.AbsolutePath.TrimStart('/')};" +
                               $"Username={userInfo[0]};" +
                               $"Password={userInfo[1]};" +
                               $"SSL Mode=Require;" +
                               $"Trust Server Certificate=true;";
        }
        else if (!builder.Environment.IsDevelopment())
        {
            // Enforce SSL for other formats in production
            if (!connectionString.Contains("SSL Mode=", StringComparison.OrdinalIgnoreCase))
            {
                connectionString += ";SSL Mode=Require;Trust Server Certificate=true;";
            }
        }

        builder.Services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseNpgsql(connectionString);
        });

        builder.Services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        builder.Services.AddScoped<IJwtProvider, JwtProvider>();

        builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

        builder.Services.Configure<JwtSettings>(
            builder.Configuration.GetSection(JwtSettings.SectionName));

        builder.Services.AddSingleton(TimeProvider.System);

        builder.Services.AddScoped<IShareCodeGenerator, ShareCodeGenerator>();

        builder.Services.AddScoped<ApplicationDbContextInitialiser>();
    }
}
