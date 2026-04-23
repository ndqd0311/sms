namespace Application.Features.Students.Commands.DeleteStudent;

public class DeleteStudentCommandValidator : AbstractValidator<DeleteStudentCommand>
{
    public DeleteStudentCommandValidator()
    {
        RuleFor(v => v.StudentId)
            .GreaterThan(0).WithMessage("StudentId must be greater than 0.");
    }
}
