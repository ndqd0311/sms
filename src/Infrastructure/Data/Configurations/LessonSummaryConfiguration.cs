namespace Infrastructure.Data.Configurations;

public class LessonSummaryConfiguration : IEntityTypeConfiguration<LessonSummary>
{
    public void Configure(EntityTypeBuilder<LessonSummary> builder)
    {
        builder.ToTable("lesson_summaries");

        builder.HasKey(x => new { x.LessonId, x.StudentId });

        builder.Property(x => x.LessonId)
            .HasColumnName("lesson_id")
            .IsRequired();

        builder.Property(x => x.StudentId)
            .HasColumnName("student_id")
            .IsRequired();

        builder.Property(x => x.FinalScore)
            .HasColumnName("final_score");

        builder.HasOne(x => x.Lesson)
            .WithMany(l => l.LessonSummaries)
            .HasForeignKey(x => x.LessonId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Student)
            .WithMany(s => s.LessonSummaries)
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
