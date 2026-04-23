namespace Infrastructure.Data.Configurations;

public class ContextBehaviorMapConfiguration : IEntityTypeConfiguration<ContextBehaviorMap>
{
    public void Configure(EntityTypeBuilder<ContextBehaviorMap> builder)
    {
        builder.ToTable("context_behavior_maps");

        builder.HasKey(x => new { x.TeachingContextId, x.BehaviorCategoryId });

        builder.Property(x => x.TeachingContextId)
            .HasColumnName("teaching_context_id")
            .IsRequired();

        builder.Property(x => x.BehaviorCategoryId)
            .HasColumnName("behavior_category_id")
            .IsRequired();

        builder.HasOne(x => x.TeachingContext)
            .WithMany(t => t.ContextBehaviorMaps)
            .HasForeignKey(x => x.TeachingContextId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.BehaviorCategory)
            .WithMany(b => b.ContextBehaviorMaps)
            .HasForeignKey(x => x.BehaviorCategoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
