using Application.Common.Interfaces;
using Application.Common.Exceptions;

namespace Application.Features.Classes.Commands.UpdateClass;

public record UpdateClassCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; }
}

public class UpdateClassCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateClassCommand>
{
    public async Task Handle(UpdateClassCommand request, CancellationToken cancellationToken)
    {
        Class? entity = await context.Classes
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Class), request.Id);
        }

        entity.Name = request.Name;

        await context.SaveChangesAsync(cancellationToken);
    }
}
