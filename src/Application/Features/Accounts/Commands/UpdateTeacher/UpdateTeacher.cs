using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Authentication;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Accounts.Commands.UpdateTeacher;

public record UpdateTeacherCommand : IRequest
{
    public int Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Password { get; init; }
    public int RoleId { get; init; }
}

public class UpdateTeacherCommandHandler(
    IApplicationDbContext context,
    IPasswordHasher passwordHasher)
    : IRequestHandler<UpdateTeacherCommand>
{
    public async Task Handle(UpdateTeacherCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Teachers
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Teacher), request.Id);
        }

        entity.FullName = request.FullName;
        entity.Email = request.Email;
        entity.RoleId = request.RoleId;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            entity.PasswordHash = passwordHasher.HashPassword(request.Password);
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
