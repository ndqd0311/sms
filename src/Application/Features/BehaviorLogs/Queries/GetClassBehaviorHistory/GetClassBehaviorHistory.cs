namespace Application.Features.BehaviorLogs.Queries.GetClassBehaviorHistory;

public record GetClassBehaviorHistory(int LessonId) : IRequest<List<ClassBehaviorDTO>>;

public class GetClassBehaviorHistoryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetClassBehaviorHistory, List<ClassBehaviorDTO>>
{
    public async Task<List<ClassBehaviorDTO>> Handle(GetClassBehaviorHistory request, CancellationToken cancellationToken)
    {
        return await context.BehaviorLogs
            .AsNoTracking()
            .Include(x => x.Student)
            .Include(x => x.BehaviorCategory)
            .Where(x => x.LessonId == request.LessonId)
            .OrderByDescending(x => x.OccurredAt)
            .ProjectTo<ClassBehaviorDTO>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
