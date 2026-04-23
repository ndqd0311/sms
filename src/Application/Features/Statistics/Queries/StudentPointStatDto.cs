namespace Application.Features.Statistics.Queries;

public record StudentPointStatDto
{
    public string LessonName { get; init; } = string.Empty;
    public DateTimeOffset LessonStartAt { get; init; }
    public int Point { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<LessonSummary, StudentPointStatDto>()
                .ForMember(d => d.LessonName,
                    opt => opt.MapFrom(s => s.Lesson != null ? s.Lesson.Name : string.Empty))
                .ForMember(d => d.LessonStartAt,
                    opt => opt.MapFrom(s => s.Lesson != null ? s.Lesson.StartAt : DateTimeOffset.MinValue))
                .ForMember(d => d.Point,
                    opt => opt.MapFrom(s => s.FinalScore ?? 0));
        }
    }
}
