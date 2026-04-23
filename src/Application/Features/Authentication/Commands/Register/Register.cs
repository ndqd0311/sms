using ValidationException = Application.Common.Exceptions.ValidationException;

namespace Application.Features.Authentication.Commands.Register;

public record RegisterCommand(string FullName, string Email, string Password, string ConfirmPassword)
    : IRequest<string>;

public class RegisterCommandHandler(
    IApplicationDbContext context,
    IJwtProvider jwtProvider,
    IPasswordHasher passwordHasher)
    : IRequestHandler<RegisterCommand, string>
{
    public async Task<string> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        bool emailExists = await context.Teachers
            .AnyAsync(x => x.Email == request.Email, cancellationToken);

        if (emailExists)
        {
            throw new ValidationException(
            [
                new ValidationFailure(
                    nameof(request.Email),
                    "Email has been used :(( ")
            ]);
        }

        Teacher teacher = new()
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            RoleId = 1 // Teacher
        };

        context.Teachers.Add(teacher);
        await context.SaveChangesAsync(cancellationToken);
        return jwtProvider.Generate(teacher);
    }
}
