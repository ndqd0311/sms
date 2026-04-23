using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Accounts.Queries.GetTeachers;

public record GetTeachersQuery : IRequest<TeachersVm>;

public class GetTeachersQueryHandler(
    IApplicationDbContext context,
    IMapper mapper)
    : IRequestHandler<GetTeachersQuery, TeachersVm>
{
    public async Task<TeachersVm> Handle(GetTeachersQuery request, CancellationToken cancellationToken)
    {
        return new TeachersVm
        {
            Teachers = await context.Teachers
                .AsNoTracking()
                .Include(x => x.Role)
                .OrderBy(x => x.FullName)
                .ProjectTo<TeacherDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
        };
    }
}

public record TeachersVm
{
    public List<TeacherDto> Teachers { get; init; } = new();
}

public record TeacherDto
{
    public int Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string RoleName { get; init; } = string.Empty;
    public int RoleId { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Teacher, TeacherDto>()
                .ForMember(d => d.RoleName, opt => opt.MapFrom(s => s.Role != null ? s.Role.Name : string.Empty));
        }
    }
}
