namespace Domain.Entities;

public class Student : BaseAuditableEntity
{
    public int ClassId { get; set; }

    public string FullName { get; set; }

    public DateTime? Birthday { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }

    public Class? Class { get; set; }

    public ICollection<LessonSummary> LessonSummaries { get; private set; } = new List<LessonSummary>();

    public ICollection<SeatAssignment> SeatAssignments { get; private set; } = new List<SeatAssignment>();

    public ICollection<BehaviorLog> BehaviorLogs { get; private set; } = new List<BehaviorLog>();

    public void MarkAsAdded(int teachingContextId, string displayName)
    {
        AddDomainEvent(new StudentAddedEvent(this, teachingContextId, displayName));
    }

    public void MarkAsDeleted()
    {
        if (DeletedAt != null)
        {
            return;
        }

        DeletedAt = DateTimeOffset.UtcNow;
    }

    public void UpdateInfo(string fullName, DateTime? birthday)
    {
        FullName = fullName;
        Birthday = birthday;
    }
}
