namespace Application.Features.Authentication.Commands.ChangePassword;

public class ChangePswCommandValidator : AbstractValidator<ChangePswCommand>
{
    public ChangePswCommandValidator()
    {
        RuleFor(x => x.NewPassword).NotEmpty()
            .WithMessage("New password missing.")
            .MinimumLength(6).WithMessage("New password must have at least 6 characters.")
            .NotEqual(x => x.OldPassword).WithMessage("New pass can't be match with old pass");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm password missing.")
            .Equal(x => x.NewPassword).WithMessage("New password and confirm password not match");

    }
}
