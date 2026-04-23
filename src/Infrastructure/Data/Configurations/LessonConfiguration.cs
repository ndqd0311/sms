using Domain.Enums;

namespace Infrastructure.Data.Configurations;

public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.ToTable("lessons");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.TeachingContextId)
            .HasColumnName("teaching_context_id")
            .IsRequired();

        builder.Property(x => x.Name)
            .HasColumnName("name")
            .HasMaxLength(150);

        builder.Property(x => x.StartAt)
            .HasColumnName("start_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.Property(x => x.EndAt)
            .HasColumnName("end_at")
            .HasColumnType("timestamptz");

        builder.Property(x => x.LessonStatus)
            .HasColumnName("lesson_status")
            .HasDefaultValue(LessonStatus.Inactive)
            .HasConversion<int>()
            .IsRequired();

        builder.HasOne(x => x.TeachingContext)
            .WithMany(t => t.Lessons)
            .HasForeignKey(x => x.TeachingContextId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
