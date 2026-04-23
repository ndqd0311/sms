namespace Domain.Entities;

public class BehaviorCategory : BaseEntity
{
    public int TeacherId { get; set; }

    public string Name { get; set; }

    public int PointValue { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }

    public Teacher? Teacher { get; set; }

    public ICollection<ContextBehaviorMap> ContextBehaviorMaps { get; private set; } = new List<ContextBehaviorMap>();

    public ICollection<BehaviorLog> BehaviorLogs { get; private set; } = new List<BehaviorLog>();
}
