namespace Application.Features.BehaviorLogs.Queries.GetStudentBehaviorHistory;

public class StudentBehaviorVm
{
    public int? TotalPoints { get; init; }
    public IReadOnlyCollection<StudentBehaviorDTO> Logs { get; init; } = [];
}
