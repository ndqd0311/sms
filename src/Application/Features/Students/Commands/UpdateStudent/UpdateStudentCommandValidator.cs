namespace Application.Features.Students.Commands.UpdateStudent;

public class UpdateStudentCommandValidator : AbstractValidator<UpdateStudentCommand>
{
    public UpdateStudentCommandValidator()
    {
        RuleFor(v => v.StudentId)
            .GreaterThan(0).WithMessage("StudentId must be greater than 0");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("FullName is required")
            .MaximumLength(150).WithMessage("FullName must not exceed 150 characters");

        RuleFor(x => x.BirthDay)
            .LessThan(DateTime.Today).When(x => x.BirthDay.HasValue)
            .WithMessage("BirthDay must be in the past");

        RuleFor(x => x.DisplayName)
            .MaximumLength(100).WithMessage("DisplayName must not exceed 100 characters")
            .When(x => x.DisplayName != null);

        RuleFor(v => v.TeachingContextId)
            .GreaterThan(0).WithMessage("TeachingContextId must be greater than 0")
            .When(x => x.TeachingContextId.HasValue);
    }
}
