namespace Infrastructure.Data.Configurations;

public class ShareCodeConfiguration : IEntityTypeConfiguration<ShareCode>
{
    public void Configure(EntityTypeBuilder<ShareCode> builder)
    {
        builder.ToTable("share_codes");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Code)
            .HasColumnName("code")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.SourceContextId)
            .HasColumnName("source_context_id")
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.ExpiredAt)
            .HasColumnName("expired_at")
            .HasColumnType("timestamptz")
            .HasDefaultValueSql("CURRENT_TIMESTAMP + INTERVAL '24 hours'")
            .ValueGeneratedOnAdd();

        builder.HasOne(x => x.TeachingContext)
            .WithMany(t => t.ShareCodes)
            .HasForeignKey(x => x.SourceContextId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
