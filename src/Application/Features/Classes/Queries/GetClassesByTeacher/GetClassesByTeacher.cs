using Application.Common.Interfaces;
using AutoMapper.QueryableExtensions;

namespace Application.Features.Classes.Queries.GetClassesByTeacher;

public record GetClassesByTeacherQuery : IRequest<ClassesVm>;

public class GetClassesByTeacherQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentTeacher currentTeacher)
    : IRequestHandler<GetClassesByTeacherQuery, ClassesVm>
{
    public async Task<ClassesVm> Handle(GetClassesByTeacherQuery request, CancellationToken cancellationToken)
    {
        string? teacherId = currentTeacher.Id;

        if (teacherId == null)
        {
            throw new UnauthorizedAccessException();
        }

        int teacherIdValue = int.Parse(teacherId);

        return new ClassesVm
        {
            Classes = await context.Classes
                .AsNoTracking()
                .Where(x => x.CreatedBy == teacherIdValue && x.DeletedAt == null)
                .OrderBy(x => x.Name)
                .ProjectTo<ClassDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
        };
    }
}
