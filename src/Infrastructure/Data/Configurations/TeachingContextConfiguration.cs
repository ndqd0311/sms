namespace Infrastructure.Data.Configurations;

public class TeachingContextConfiguration : IEntityTypeConfiguration<TeachingContext>
{
    public void Configure(EntityTypeBuilder<TeachingContext> builder)
    {
        builder.ToTable("teaching_contexts");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.TeacherId)
            .HasColumnName("teacher_id")
            .IsRequired();

        builder.Property(x => x.ClassId)
            .HasColumnName("class_id")
            .IsRequired();

        builder.Property(x => x.ContextName)
            .HasColumnName("context_name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(x => x.NumCols)
            .HasColumnName("num_cols")
            .IsRequired();

        builder.Property(x => x.NumRows)
            .HasColumnName("num_rows")
            .IsRequired();

        builder.Property(x => x.SeatsPerTable)
            .HasColumnName("seats_per_table")
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.DeletedAt)
            .HasColumnName("deleted_at")
            .HasColumnType("timestamptz");

        builder.HasOne(x => x.Teacher)
            .WithMany(t => t.TeachingContexts)
            .HasForeignKey(x => x.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Class)
            .WithMany(c => c.TeachingContexts)
            .HasForeignKey(x => x.ClassId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
