namespace Domain.Entities;

public class LessonSummary : BaseEntity
{
    public int LessonId { get; set; }

    public int StudentId { get; set; }

    public int? FinalScore { get; set; }

    public Lesson? Lesson { get; set; }

    public Student? Student { get; set; }
}
