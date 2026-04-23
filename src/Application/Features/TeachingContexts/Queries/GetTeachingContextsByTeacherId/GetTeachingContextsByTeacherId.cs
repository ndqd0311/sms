namespace Application.Features.TeachingContexts.Queries.GetTeachingContextsByTeacherId;

public record GetTeachingContextsByTeacherIdQuery : IRequest<TeachingContextsVm>;

public class GetTeachingContextsByTeacherIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper,
    ICurrentTeacher currentTeacher)
    : IRequestHandler<GetTeachingContextsByTeacherIdQuery, TeachingContextsVm>
{
    public async Task<TeachingContextsVm> Handle(GetTeachingContextsByTeacherIdQuery request,
        CancellationToken cancellationToken)
    {
        var query = context.TeachingContexts
            .AsNoTracking()
            .Where(tc => tc.DeletedAt == null);

        if (currentTeacher.Role != "Admin")
        {
            query = query.Where(tc => tc.TeacherId == int.Parse(currentTeacher.Id!));
        }

        return new TeachingContextsVm
        {
            TeachingContexts = await query
                .OrderBy(tc => tc.Id)
                .ProjectTo<TeachingContextDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
        };
    }
}
