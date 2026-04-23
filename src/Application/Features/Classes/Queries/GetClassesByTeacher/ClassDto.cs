namespace Application.Features.Classes.Queries.GetClassesByTeacher;

public class ClassDto
{
    public int Id { get; init; }
    public string Name { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Class, ClassDto>();
        }
    }
}
