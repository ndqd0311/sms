namespace Application.Features.Classes.Queries.GetClassesByTeacher;

public class ClassesVm
{
    public IReadOnlyCollection<ClassDto> Classes { get; init; } = Array.Empty<ClassDto>();
}
