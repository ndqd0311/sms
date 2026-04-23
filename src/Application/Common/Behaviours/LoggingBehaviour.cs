using MediatR.Pipeline;
using Microsoft.Extensions.Logging;

namespace Application.Common.Behaviours;

public class LoggingBehaviour<TRequest>(ILogger<TRequest> logger, ICurrentTeacher currentTeacher)
    : IRequestPreProcessor<TRequest>
    where TRequest : notnull
{
    public Task Process(TRequest request, CancellationToken cancellationToken)
    {
        string requestName = typeof(TRequest).Name;
        string userId = currentTeacher.Id ?? string.Empty;

        if (logger.IsEnabled(LogLevel.Information))
        {
            logger.LogInformation("Request: {Name} {@UserId} {@Request}",
                requestName, userId, request);
        }

        return Task.CompletedTask;
    }
}
