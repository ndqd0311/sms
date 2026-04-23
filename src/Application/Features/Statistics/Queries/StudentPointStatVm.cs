namespace Application.Features.Statistics.Queries;

public class StudentPointStatVm
{
    public int StudentId { get; init; }
    public int TotalPoints { get; init; }
    public IReadOnlyCollection<StudentPointStatDto> Stats { get; init; } = [];
}
