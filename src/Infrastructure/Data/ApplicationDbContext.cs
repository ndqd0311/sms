using Application.Common.Interfaces;

namespace Infrastructure.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IApplicationDbContext
{
    public DbSet<BehaviorCategory> BehaviorCategories => Set<BehaviorCategory>();

    public DbSet<BehaviorLog> BehaviorLogs => Set<BehaviorLog>();

    public DbSet<Class> Classes => Set<Class>();

    public DbSet<ContextBehaviorMap> ContextBehaviorMaps => Set<ContextBehaviorMap>();

    public DbSet<LessonSummary> LessonSummaries => Set<LessonSummary>();

    public DbSet<Lesson> Lessons => Set<Lesson>();

    public DbSet<SeatAssignment> SeatAssignments => Set<SeatAssignment>();

    public DbSet<ShareCode> ShareCodes => Set<ShareCode>();

    public DbSet<Student> Students => Set<Student>();

    public DbSet<Teacher> Teachers => Set<Teacher>();

    public DbSet<TeachingContext> TeachingContexts => Set<TeachingContext>();
    
    public DbSet<Role> Roles => Set<Role>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
