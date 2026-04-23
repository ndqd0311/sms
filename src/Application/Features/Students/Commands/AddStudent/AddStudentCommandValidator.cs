namespace Application.Features.Students.Commands.AddStudent;

public class AddStudentCommandValidator : AbstractValidator<AddStudentCommand>
{
    public AddStudentCommandValidator()
    {
        RuleFor(x => x.ClassId)
            .GreaterThan(0).WithMessage("ClassId must be greater than 0");

        RuleFor(x => x.TeachingContextId)
            .GreaterThan(0).WithMessage("TeachingContextId must be greater than 0");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("FullName is required")
            .MaximumLength(150).WithMessage("FullName must not exceed 150 characters");

        RuleFor(x => x.DisplayName)
            .NotEmpty().WithMessage("Display name is required.")
            .MaximumLength(100).WithMessage("DisplayName must not exceed 100 characters");

        RuleFor(x => x.OrdinalIndex).NotNull();

        RuleFor(x => x.BirthDay)
            .LessThan(DateTime.Today).When(x => x.BirthDay.HasValue)
            .WithMessage("BirthDay must be in the past");
    }
}
