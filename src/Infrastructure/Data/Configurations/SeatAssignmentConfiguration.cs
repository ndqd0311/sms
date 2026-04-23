namespace Infrastructure.Data.Configurations;

public class SeatAssignmentConfiguration : IEntityTypeConfiguration<SeatAssignment>
{
    public void Configure(EntityTypeBuilder<SeatAssignment> builder)
    {
        builder.ToTable("seat_assignments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.TeachingContextId)
            .HasColumnName("teaching_context_id")
            .IsRequired();

        builder.Property(x => x.StudentId)
            .HasColumnName("student_id")
            .IsRequired();

        builder.Property(x => x.DisplayName)
            .HasColumnName("display_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.OrdinalIndex)
            .HasColumnName("ordinal_index")
            .IsRequired();

        builder.HasOne(x => x.TeachingContext)
            .WithMany(t => t.SeatAssignments)
            .HasForeignKey(x => x.TeachingContextId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Student)
            .WithMany(s => s.SeatAssignments)
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.TeachingContextId, x.StudentId })
            .IsUnique();

        builder.HasIndex(x => new { x.TeachingContextId, x.OrdinalIndex })
            .IsUnique()
            .HasFilter("ordinal_index <> -1");
    }
}
