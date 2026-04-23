namespace Domain.Entities;

public class Class : BaseAuditableEntity
{
    public string Name { get; set; }

    public int CreatedBy { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }

    public Teacher? Teacher { get; set; }

    public ICollection<Student> Students { get; private set; } = new List<Student>();

    public ICollection<TeachingContext> TeachingContexts { get; private set; } = new List<TeachingContext>();
}
