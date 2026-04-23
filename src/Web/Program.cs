using Infrastructure.Data;
using Web.Services;

namespace Web;

public class Program
{
    public static async Task Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.AddApplicationServices();
        builder.AddInfrastructureServices();
        builder.AddWebServices();

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            await app.InitialiseDatabaseAsync();
        }

        app.UseExceptionHandler();
        app.UseHttpsRedirection();
        app.UseCors();
        app.UseRateLimiter();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();
        }

        app.Run();
    }
}
