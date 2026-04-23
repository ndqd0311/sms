using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.BehaviorLogs.Queries.GetStudentBehaviorHistoryInContext;

public record GetStudentBehaviorHistoryInContextQuery(int TeachingContextId, int StudentId) 
    : IRequest<StudentBehaviorContextVm>;

public class GetStudentBehaviorHistoryInContextHandler(
    IApplicationDbContext context, 
    IMapper mapper) 
    : IRequestHandler<GetStudentBehaviorHistoryInContextQuery, StudentBehaviorContextVm>
{
    public async Task<StudentBehaviorContextVm> Handle(GetStudentBehaviorHistoryInContextQuery request, CancellationToken ct)
    {
        // Get all lessons for this context
        var lessonIds = await context.Lessons
            .Where(l => l.TeachingContextId == request.TeachingContextId)
            .Select(l => l.Id)
            .ToListAsync(ct);

        // Fetch logs for this student in these lessons
        var logs = await context.BehaviorLogs
            .AsNoTracking()
            .Where(x => lessonIds.Contains(x.LessonId) && x.StudentId == request.StudentId)
            .OrderByDescending(x => x.OccurredAt)
            .ProjectTo<StudentBehaviorContextDTO>(mapper.ConfigurationProvider)
            .ToListAsync(ct);

        return new StudentBehaviorContextVm
        {
            Logs = logs
        };
    }
}

public record StudentBehaviorContextVm
{
    public List<StudentBehaviorContextDTO> Logs { get; init; } = new();
}

public record StudentBehaviorContextDTO
{
    public string BehaviorName { get; set; } = string.Empty;
    public int PointValue { get; set; }
    public DateTimeOffset OccurredAt { get; set; }
    public string LessonName { get; set; } = string.Empty;

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<BehaviorLog, StudentBehaviorContextDTO>()
                .ForMember(d => d.BehaviorName,
                    opt => opt.MapFrom(s => s.BehaviorCategory != null ? s.BehaviorCategory.Name : string.Empty))
                .ForMember(d => d.PointValue,
                    opt => opt.MapFrom(s => s.BehaviorCategory != null ? s.BehaviorCategory.PointValue : 0))
                .ForMember(d => d.LessonName,
                    opt => opt.MapFrom(s => s.Lesson != null ? s.Lesson.Name : string.Empty));
        }
    }
}
