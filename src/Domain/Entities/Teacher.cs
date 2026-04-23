namespace Domain.Entities;

public class Teacher : BaseAuditableEntity
{
    public string FullName { get; set; }

    public string Email { get; set; }

    public string PasswordHash { get; set; }
    
    public int RoleId { get; set; }

    public ICollection<Class> Classes { get; private set; } = new List<Class>();

    public ICollection<TeachingContext> TeachingContexts { get; private set; } = new List<TeachingContext>();

    public ICollection<BehaviorCategory> BehaviorCategories { get; private set; } = new List<BehaviorCategory>();
    public Role? Role { get; set; }
}
