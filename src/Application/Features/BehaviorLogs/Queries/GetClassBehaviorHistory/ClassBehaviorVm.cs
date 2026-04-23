namespace Application.Features.BehaviorLogs.Queries.GetClassBehaviorHistory;

public class ClassBehaviorVm
{
    public IReadOnlyCollection<ClassBehaviorDTO> ClassBehaviors { get; init; } = [];
}
