namespace Domain.Entities;

public class TeachingContext : BaseAuditableEntity
{
    public int TeacherId { get; set; }

    public int ClassId { get; set; }

    public string ContextName { get; set; }

    public int NumCols { get; set; }

    public int NumRows { get; set; }

    public int SeatsPerTable { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }

    public Teacher? Teacher { get; set; }

    public Class? Class { get; set; }

    public ICollection<ShareCode> ShareCodes { get; private set; } = new List<ShareCode>();

    public ICollection<Lesson> Lessons { get; private set; } = new List<Lesson>();

    public ICollection<ContextBehaviorMap> ContextBehaviorMaps { get; private set; } = new List<ContextBehaviorMap>();

    public ICollection<SeatAssignment> SeatAssignments { get; private set; } = new List<SeatAssignment>();

    public TeachingContext Clone(int teacherId, string contextName)
    {
        return new TeachingContext
        {
            TeacherId = teacherId,
            ClassId = ClassId,
            ContextName = contextName,
            NumCols = NumCols,
            NumRows = NumRows,
            SeatsPerTable = SeatsPerTable
        };
    }
}
