using Application.Common.Exceptions;
using ValidationException = FluentValidation.ValidationException;

namespace Application.Features.Authentication.Commands.ChangePassword;

public record ChangePswCommand(string OldPassword, string NewPassword, string ConfirmPassword) : IRequest;

public class ChangePswCommandHandler(IApplicationDbContext context, IPasswordHasher passwordHasher, ICurrentTeacher currentTeacher)
    : IRequestHandler<ChangePswCommand>
{
    public async Task Handle(ChangePswCommand request, CancellationToken cancellationToken)
    {
        var teacherId = int.Parse(currentTeacher.Id!);
        Teacher? teacher = await context.Teachers
            .FirstOrDefaultAsync(x => x.Id == teacherId, cancellationToken);
        if (teacher is null)
        {
            throw new NotFoundException(nameof(Teacher), teacherId);
        }

        bool isOldPassValid = passwordHasher.VerifyPassword(request.OldPassword, teacher.PasswordHash);
        if (!passwordHasher.VerifyPassword(request.OldPassword, teacher.PasswordHash))
        {
            throw new ValidationException([
                new ValidationFailure(nameof(request.OldPassword), "Mật khẩu cũ không chính xác.")
            ]);
        }

        if (request.OldPassword == request.NewPassword)
        {
            throw new ValidationException([
                new ValidationFailure(
                    nameof(request.NewPassword), "New password can't match old password")
            ]);
        }

        teacher.PasswordHash = passwordHasher.HashPassword(request.NewPassword);
        await context.SaveChangesAsync(cancellationToken);
    }
}
