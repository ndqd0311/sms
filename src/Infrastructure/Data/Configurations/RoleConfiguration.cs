namespace Infrastructure.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("role_id").ValueGeneratedOnAdd();

        builder.HasData(
            new Role { Id = 1, Name = "Teacher" },
            new Role { Id = 2, Name = "Admin" }
        );
    }
}
