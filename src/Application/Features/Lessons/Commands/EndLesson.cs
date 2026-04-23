using Application.Common.Exceptions;
namespace Application.Features.Lessons.Commands;

public record EndLessonCommand(int Id) : IRequest<int>;
public class EndLessonHandler(IApplicationDbContext context) : IRequestHandler<EndLessonCommand, int>
{
    public async Task<int> Handle(EndLessonCommand request, CancellationToken cancellationToken)
    {
        var lesson = await context.Lessons.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (lesson is null)
        {
            throw new NotFoundException(nameof(Lesson), request.Id);
        }

        lesson.EndAt = DateTime.UtcNow;
        lesson.LessonStatus = LessonStatus.Inactive;
        await context.SaveChangesAsync(cancellationToken);
        return lesson.Id;
    }
}
