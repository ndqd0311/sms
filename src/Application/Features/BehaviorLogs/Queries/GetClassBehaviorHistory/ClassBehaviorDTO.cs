namespace Application.Features.BehaviorLogs.Queries.GetClassBehaviorHistory;

public record ClassBehaviorDTO
{
    public string StudentName { get; set; } = string.Empty;
    public string BehaviorName { get; set; } = string.Empty;
    public DateTimeOffset OccurredAt { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<BehaviorLog, ClassBehaviorDTO>()
                .ForMember(d => d.StudentName, opt => opt.MapFrom(s => s.Student != null ? s.Student.FullName : string.Empty))
                .ForMember(d => d.BehaviorName, opt => opt.MapFrom(s => s.BehaviorCategory != null ? s.BehaviorCategory.Name : string.Empty));
        }
    }
}

