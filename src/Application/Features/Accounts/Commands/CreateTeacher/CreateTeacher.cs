using Application.Common.Interfaces;
using Application.Common.Interfaces.Authentication;
using Domain.Entities;
using MediatR;

namespace Application.Features.Accounts.Commands.CreateTeacher;

public record CreateTeacherCommand : IRequest<int>
{
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public int RoleId { get; init; }
}

public class CreateTeacherCommandHandler(
    IApplicationDbContext context,
    IPasswordHasher passwordHasher)
    : IRequestHandler<CreateTeacherCommand, int>
{
    public async Task<int> Handle(CreateTeacherCommand request, CancellationToken cancellationToken)
    {
        var teacher = new Teacher
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            RoleId = request.RoleId
        };

        context.Teachers.Add(teacher);
        await context.SaveChangesAsync(cancellationToken);

        return teacher.Id;
    }
}
