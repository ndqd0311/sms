namespace Application.Features.Authentication.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email can't be empty")
            .EmailAddress().WithMessage("Email is not in the correct format ");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password can't be empty")
            .MinimumLength(6).WithMessage("Password must have at least 6 characters");
    }
}
