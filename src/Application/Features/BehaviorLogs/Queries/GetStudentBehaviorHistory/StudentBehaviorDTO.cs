namespace Application.Features.BehaviorLogs.Queries.GetStudentBehaviorHistory;

public record StudentBehaviorDTO
{
    public string BehaviorName { get; set; } = string.Empty;
    public int PointValue { get; set; }
    public DateTimeOffset OccurredAt { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<BehaviorLog, StudentBehaviorDTO>()
                .ForMember(d => d.BehaviorName,
                    opt => opt.MapFrom(s => s.BehaviorCategory != null ? s.BehaviorCategory.Name : string.Empty))
                .ForMember(d => d.PointValue,
                    opt => opt.MapFrom(s => s.BehaviorCategory != null ? s.BehaviorCategory.PointValue : 0));
        }
    }
}
