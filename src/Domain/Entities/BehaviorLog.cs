namespace Domain.Entities;

public class BehaviorLog : BaseAuditableEntity
{
    public int LessonId { get; set; }

    public int StudentId { get; set; }

    public int BehaviorCategoryId { get; set; }
    
    public DateTimeOffset OccurredAt { get; set; }

    public Lesson? Lesson { get; set; }

    public Student? Student { get; set; }

    public BehaviorCategory? BehaviorCategory { get; set; }
}
