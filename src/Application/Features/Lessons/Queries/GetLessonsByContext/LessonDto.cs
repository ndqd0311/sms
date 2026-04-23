namespace Application.Features.Lessons.Queries.GetLessonsByContext;

public record LessonDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public DateTimeOffset StartAt { get; init; }
    public DateTimeOffset? EndAt { get; init; }
    public string LessonStatus { get; init; } = string.Empty;

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Lesson, LessonDto>()
                .ForMember(d => d.LessonStatus, opt => opt.MapFrom(s => s.LessonStatus.ToString()));
        }
    }
}
