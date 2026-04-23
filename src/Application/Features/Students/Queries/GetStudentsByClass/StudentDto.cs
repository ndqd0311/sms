namespace Application.Features.Students.Queries.GetStudentsByClass;

public class StudentDto
{
    public int Id { get; init; }
    public string FullName { get; init; }
    public DateTime? Birthday { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Student, StudentDto>();
        }
    }
}
