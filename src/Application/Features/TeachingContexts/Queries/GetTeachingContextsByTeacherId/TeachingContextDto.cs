namespace Application.Features.TeachingContexts.Queries.GetTeachingContextsByTeacherId;

public class TeachingContextDto
{
    public int Id { get; init; }

    public string ContextName { get; init; }

    public int NumCols { get; init; }

    public int NumRows { get; init; }

    public int SeatsPerTable { get; init; }

    public int ClassId { get; init; }

    public string ClassName { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<TeachingContext, TeachingContextDto>()
                .ForMember(d => d.ClassName, opt => opt.MapFrom(s => s.Class != null ? s.Class.Name : "Lớp chưa đặt tên"));
        }
    }
}
