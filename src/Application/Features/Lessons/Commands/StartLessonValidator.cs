namespace Application.Features.Lessons.Commands;

public class StartLessonValidator : AbstractValidator<StartLessonCommand>
{
    public StartLessonValidator()
    {
        RuleFor(x => x.TeachingContextId).NotEmpty().NotNull();
        RuleFor(x => x.Name).MaximumLength(70);
    }
}
