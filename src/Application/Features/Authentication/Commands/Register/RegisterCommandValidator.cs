namespace Application.Features.Authentication.Commands.Register;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Missing Name")
            .MaximumLength(100).WithMessage("Name can't be more than 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email missing.")
            .EmailAddress().WithMessage("Email is not in the correct format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password missing.")
            .MinimumLength(6).WithMessage("Password must have at least 6 characters.");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm password missing.")
            .Equal(x => x.Password).WithMessage("Confirm password not matched");
    }
}
