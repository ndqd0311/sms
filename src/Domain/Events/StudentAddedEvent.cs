namespace Domain.Events;

public class StudentAddedEvent(Student student, int teachingContextId, string displayName) : BaseEvent
{
    public override EventTiming Timing => EventTiming.PreSave;

    public Student Student { get; } = student;

    public int ClassId { get; } = student.ClassId;

    public int TeachingContextId { get; } = teachingContextId;

    public string DisplayName { get; } = displayName;
}
