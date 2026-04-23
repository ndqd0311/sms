namespace Application.Features.TeachingContexts.Commands.CreateTeachingContext;

public class CreateTeachingContextCommandValidator : AbstractValidator<CreateTeachingContextCommand>
{
    public CreateTeachingContextCommandValidator()
    {
        RuleFor(v => v.ClassName)
            .MaximumLength(150).WithMessage("Class name can't be more than 150 characters.")
            .NotEmpty().WithMessage("Class name is missing.");

        RuleFor(v => v.TeachingContextName)
            .MaximumLength(255).WithMessage("Teaching context name can't be more than 255 characters.")
            .NotEmpty().WithMessage("Teaching context name is missing.");

        RuleFor(v => v.NumCols)
            .GreaterThan(0).WithMessage("Number of columns must be greater than 0.");

        RuleFor(v => v.NumRows)
            .GreaterThan(0).WithMessage("Number of rows must be greater than 0.");

        RuleFor(v => v.SeatsPerTable)
            .GreaterThan(0).WithMessage("Seats per table must be greater than 0.");
    }
}
