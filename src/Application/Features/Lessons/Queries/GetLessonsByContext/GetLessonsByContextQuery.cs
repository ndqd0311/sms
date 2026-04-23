namespace Application.Features.Lessons.Queries.GetLessonsByContext;

using AutoMapper.QueryableExtensions;

public record GetLessonsByContextQuery(int TeachingContextId) : IRequest<LessonVm>;

public class GetLessonsByContextHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetLessonsByContextQuery, LessonVm>
{
    public async Task<LessonVm> Handle(GetLessonsByContextQuery request, CancellationToken cancellationToken)
    {
        var items = await context.Lessons
            .AsNoTracking()
            .Where(x => x.TeachingContextId == request.TeachingContextId)
            .OrderByDescending(x => x.StartAt)
            .ProjectTo<LessonDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new LessonVm { Lessons = items };
    }
}
