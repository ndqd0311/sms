using Application.Common.Exceptions;
using ValidationException = FluentValidation.ValidationException;

namespace Application.Features.Lessons.Commands;

public record StartLessonCommand(int TeachingContextId, string Name) : IRequest<int>;
public class StartLesson(IApplicationDbContext context) 
    : IRequestHandler<StartLessonCommand, int>
{
    public async Task<int> Handle(StartLessonCommand request, CancellationToken cancellationToken)
    {
        var contextExists = await context.TeachingContexts
            .AnyAsync(x => x.Id == request.TeachingContextId, cancellationToken);
            
        if (!contextExists)
        {
            throw new NotFoundException(nameof(TeachingContext), request.TeachingContextId);
        }
        
        var hasOngoingLesson = await context.Lessons
            .AnyAsync(x => x.TeachingContextId == request.TeachingContextId && 
                           x.LessonStatus == LessonStatus.Ongoing, cancellationToken);

        if (hasOngoingLesson)
        {
            throw new ValidationException(new[] 
            { 
                new ValidationFailure("General", "Tiết học đang diễn ra cho bối cảnh này. Vui lòng kết thúc tiết học trước khi bắt đầu tiết mới.") 
            });
        }
        
        string lessonName = request.Name;
        if (string.IsNullOrWhiteSpace(lessonName))
        {
            var now = DateTime.UtcNow.AddHours(7); // Bù giờ Việt Nam (UTC+7) cho tên tiết học
            string period = now.Hour < 12 ? "Sáng" : "Chiều";
            lessonName = $"Tiết học {period} - {now:dd/MM/yyyy}";
        }
        
        Domain.Entities.Lesson lesson = new() 
        {
            TeachingContextId = request.TeachingContextId,
            Name = lessonName,
            StartAt = DateTime.UtcNow, // Luôn dùng UTC khi lưu xuống DB PostgreSQL
            LessonStatus = LessonStatus.Ongoing
        };
        
        context.Lessons.Add(lesson);
        await context.SaveChangesAsync(cancellationToken);

        var seatedStudentIds = await context.SeatAssignments
            .Where(sa => sa.TeachingContextId == request.TeachingContextId && sa.StudentId != 0)
            .Select(sa => sa.StudentId)
            .Distinct()
            .ToListAsync(cancellationToken);

        foreach (int studentId in seatedStudentIds)
        {
            context.LessonSummaries.Add(new LessonSummary
            {
                LessonId = lesson.Id,
                StudentId = studentId,
                FinalScore = 0
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        return lesson.Id;
    }
}
