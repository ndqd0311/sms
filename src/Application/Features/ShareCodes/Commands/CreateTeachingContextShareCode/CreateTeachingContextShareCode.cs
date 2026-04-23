using Application.Common.Exceptions;

namespace Application.Features.ShareCodes.Commands.CreateTeachingContextShareCode;

public record CreateTeachingContextShareCodeCommand : IRequest<string>
{
    public int TeachingContextId { get; init; }
}

public class CreateTeachingContextShareCodeCommandHandler(
    IApplicationDbContext context,
    ICurrentTeacher currentTeacher,
    IShareCodeGenerator shareCodeGenerator)
    : IRequestHandler<CreateTeachingContextShareCodeCommand, string>
{
    public async Task<string> Handle(CreateTeachingContextShareCodeCommand request, CancellationToken cancellationToken)
    {
        int teacherId = await context.TeachingContexts
            .Where(tc => tc.Id == request.TeachingContextId)
            .Select(tc => tc.TeacherId)
            .FirstOrDefaultAsync(cancellationToken);

        if (teacherId != int.Parse(currentTeacher.Id!))
        {
            throw new ForbiddenAccessException();
        }

        ShareCode newShareCode =
            new() { Code = shareCodeGenerator.Generate(), SourceContextId = request.TeachingContextId };

        context.ShareCodes.Add(newShareCode);

        await context.SaveChangesAsync(cancellationToken);

        return newShareCode.Code;
    }
}
