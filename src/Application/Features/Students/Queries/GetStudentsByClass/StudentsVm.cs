namespace Application.Features.Students.Queries.GetStudentsByClass;

public class StudentsVm
{
    public IReadOnlyCollection<StudentDto> Students { get; init; } = Array.Empty<StudentDto>();
}
