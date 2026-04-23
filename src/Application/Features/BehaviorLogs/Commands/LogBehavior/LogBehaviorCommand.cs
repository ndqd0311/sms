using Application.Common.Exceptions;
using ValidationException = Application.Common.Exceptions.ValidationException;

namespace Application.Features.BehaviorLogs.Commands.LogBehavior;

public record LogBehaviorCommand(int LessonId, int StudentId, int BehaviorCategoryId) : IRequest<int>;

public class LogBehaviorCommandHandler(IApplicationDbContext context)
    : IRequestHandler<LogBehaviorCommand, int>
{
    public async Task<int> Handle(LogBehaviorCommand request, CancellationToken cancellationToken)
    {
        Lesson? lesson = await context.Lessons
            .FirstOrDefaultAsync(x => x.Id == request.LessonId, cancellationToken);

        if (lesson is null)
        {
            throw new NotFoundException(nameof(Lesson), request.LessonId);
        }

        if (lesson.LessonStatus != LessonStatus.Ongoing)
        {
            throw new ValidationException([
                new ValidationFailure(
                    nameof(request.LessonId),
                    "Lesson finished or hadn't started yet, can't log behavior")
            ]);
        }

        bool studentExists = await context.Students.AnyAsync(x => x.Id == request.StudentId, cancellationToken);
        if (!studentExists)
        {
            throw new NotFoundException(nameof(Student), request.StudentId);
        }

        BehaviorCategory? behaviorCategory = await context.BehaviorCategories
            .FirstOrDefaultAsync(x => x.Id == request.BehaviorCategoryId, cancellationToken);

        if (behaviorCategory is null)
        {
            throw new NotFoundException(nameof(BehaviorCategory), request.BehaviorCategoryId);
        }

        BehaviorLog log = new()
        {
            LessonId = request.LessonId,
            StudentId = request.StudentId,
            BehaviorCategoryId = request.BehaviorCategoryId,
            OccurredAt = DateTimeOffset.UtcNow 
        };

        context.BehaviorLogs.Add(log);

        LessonSummary? summary = await context.LessonSummaries
            .FirstOrDefaultAsync(x => x.LessonId == request.LessonId && x.StudentId == request.StudentId,
                cancellationToken);

        if (summary == null)
        {
            summary = new LessonSummary
            {
                LessonId = request.LessonId,
                StudentId = request.StudentId,
                FinalScore = behaviorCategory.PointValue
            };
            context.LessonSummaries.Add(summary);
        }
        else
        {
            summary.FinalScore = (summary.FinalScore ?? 0) + behaviorCategory.PointValue;
        }

        await context.SaveChangesAsync(cancellationToken);
        return log.Id;
    }
}
