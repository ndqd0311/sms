using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Accounts.Commands.DeleteTeacher;

public record DeleteTeacherCommand(int Id) : IRequest;

public class DeleteTeacherCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteTeacherCommand>
{
    public async Task Handle(DeleteTeacherCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Teachers
            .Include(x => x.Classes)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Teacher), request.Id);
        }

        // Potential logic: Soft delete or check for dependencies
        // For now, let's just do a hard delete as it's an admin feature
        context.Teachers.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }
}
