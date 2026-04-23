using Application.Common.Interfaces;
using Application.Common.Exceptions;

namespace Application.Features.Classes.Commands.DeleteClass;

public record DeleteClassCommand : IRequest
{
    public int Id { get; init; }
}

public class DeleteClassCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteClassCommand>
{
    public async Task Handle(DeleteClassCommand request, CancellationToken cancellationToken)
    {
        Class? entity = await context.Classes
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Class), request.Id);
        }

        entity.DeletedAt = DateTimeOffset.UtcNow;

        await context.SaveChangesAsync(cancellationToken);
    }
}
