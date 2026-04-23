using Application.Common.Interfaces;
using AutoMapper.QueryableExtensions;

namespace Application.Features.Students.Queries.GetStudentsByClass;

public record GetStudentsByClassQuery : IRequest<StudentsVm>
{
    public int ClassId { get; init; }
}

public class GetStudentsByClassQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetStudentsByClassQuery, StudentsVm>
{
    public async Task<StudentsVm> Handle(GetStudentsByClassQuery request, CancellationToken cancellationToken)
    {
        return new StudentsVm
        {
            Students = await context.Students
                .AsNoTracking()
                .Where(x => x.ClassId == request.ClassId && x.DeletedAt == null)
                .OrderBy(x => x.FullName)
                .ProjectTo<StudentDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
        };
    }
}
