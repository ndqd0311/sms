namespace Application.Features.ShareCodes.Commands.ImportTeachingContextShareCode;

public class ImportTeachingContextShareCodeCommandValidator : AbstractValidator<ImportTeachingContextShareCodeCommand>
{
    public ImportTeachingContextShareCodeCommandValidator()
    {
        RuleFor(v => v.ShareCode)
            .NotEmpty().WithMessage("Share code is missing.");
    }
}
