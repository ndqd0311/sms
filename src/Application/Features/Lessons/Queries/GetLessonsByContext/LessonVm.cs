namespace Application.Features.Lessons.Queries.GetLessonsByContext;

public class LessonVm
{
    public IReadOnlyCollection<LessonDto> Lessons { get; init; } = [];
}
