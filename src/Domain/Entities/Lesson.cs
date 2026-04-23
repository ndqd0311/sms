namespace Domain.Entities;

public class Lesson : BaseEntity
{
    public int TeachingContextId { get; set; }

    public string Name { get; set; }

    public DateTimeOffset StartAt { get; set; }

    public DateTimeOffset? EndAt { get; set; }

    public LessonStatus LessonStatus { get; set; }

    public TeachingContext? TeachingContext { get; set; }

    public ICollection<LessonSummary> LessonSummaries { get; private set; } = new List<LessonSummary>();

    public ICollection<BehaviorLog> BehaviorLogs { get; private set; } = new List<BehaviorLog>();
}
