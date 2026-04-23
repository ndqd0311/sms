namespace Application.Features.Statistics.Queries;

using AutoMapper.QueryableExtensions;

public record GetStudentPointStatisticsQuery(int StudentId) : IRequest<StudentPointStatVm>;

public class GetStudentPointStatisticsHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetStudentPointStatisticsQuery, StudentPointStatVm>
{
    public async Task<StudentPointStatVm> Handle(GetStudentPointStatisticsQuery request, CancellationToken cancellationToken)
    {
        var stats = await context.LessonSummaries
            .AsNoTracking()
            .Include(x => x.Lesson)
            .Where(x => x.StudentId == request.StudentId)
            .OrderBy(x => x.Lesson!.StartAt)
            .ProjectTo<StudentPointStatDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        int totalPoints = stats.Sum(x => x.Point);

        return new StudentPointStatVm
        {
            StudentId = request.StudentId,
            TotalPoints = totalPoints,
            Stats = stats
        };
    }
}
