namespace Application.Features.TeachingContexts.Queries.GetTeachingContextsByTeacherId;

public class TeachingContextsVm
{
    public IReadOnlyCollection<TeachingContextDto> TeachingContexts { get; init; } = [];
}
