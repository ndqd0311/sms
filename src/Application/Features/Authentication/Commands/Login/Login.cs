namespace Application.Features.Authentication.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<string>;

public class LoginCommandHandler(
    IApplicationDbContext context,
    IJwtProvider jwtProvider,
    IPasswordHasher passwordHasher)
    : IRequestHandler<LoginCommand, string>
{
    public async Task<string> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        Teacher? teacher = await context.Teachers
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (teacher is null || !passwordHasher.VerifyPassword(request.Password, teacher.PasswordHash))
        {
            throw new UnauthorizedAccessException("Email or password is incorrect");
        }

        return jwtProvider.Generate(teacher);
    }
}
