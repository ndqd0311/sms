namespace Application.Features.ShareCodes.Commands.CreateTeachingContextShareCode;

public class CreateTeachingContextShareCodeCommandValidator : AbstractValidator<CreateTeachingContextShareCodeCommand>
{
    public CreateTeachingContextShareCodeCommandValidator()
    {
        RuleFor(x => x.TeachingContextId)
            .GreaterThan(0)
            .WithMessage("TeachingContextId must be greater than 0");
    }
}
