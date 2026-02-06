namespace ExpenseTracker.Infrastructure.Mappings;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Entities.Enums;

public class CategoryMap : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Description)
            .IsRequired()
            .HasMaxLength(400);

        builder.Property(c => c.Purpose)
            .IsRequired()
            .HasConversion<string>();
    }
}
