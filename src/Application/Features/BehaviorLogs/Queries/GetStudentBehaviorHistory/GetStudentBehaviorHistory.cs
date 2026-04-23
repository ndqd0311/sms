namespace Application.Features.BehaviorLogs.Queries.GetStudentBehaviorHistory;

using AutoMapper.QueryableExtensions;

public record GetStudentBehaviorHistoryQuery(int LessonId, int StudentId) 
    : IRequest<StudentBehaviorVm>;

public class GetStudentBehaviorHistoryHandler(
    IApplicationDbContext context, 
    IMapper mapper) 
    : IRequestHandler<GetStudentBehaviorHistoryQuery, StudentBehaviorVm>
{
    public async Task<StudentBehaviorVm> Handle(GetStudentBehaviorHistoryQuery request, CancellationToken ct)
    {
        var totalPoints = await context.LessonSummaries
            .AsNoTracking()
            .Where(x => x.LessonId == request.LessonId && x.StudentId == request.StudentId)
            .Select(x => x.FinalScore)
            .FirstOrDefaultAsync(ct);
        
        var logs = await context.BehaviorLogs
            .AsNoTracking()
            .Where(x => x.LessonId == request.LessonId && x.StudentId == request.StudentId)
            .OrderByDescending(x => x.OccurredAt)
            .ProjectTo<StudentBehaviorDTO>(mapper.ConfigurationProvider)
            .ToListAsync(ct);
        return new StudentBehaviorVm
        {
            TotalPoints = totalPoints,
            Logs = logs
        };
    }
}
