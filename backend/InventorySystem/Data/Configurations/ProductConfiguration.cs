using InventorySystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InventorySystem.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(p => p.Name).IsRequired().HasMaxLength(200);
        builder.HasIndex(p => p.Name);

        builder.Property(p => p.Description).HasMaxLength(500);
        builder.Property(p => p.Category).IsRequired().HasMaxLength(100);
        builder.HasIndex(p => p.Category);

        builder.Property(p => p.SKU).IsRequired().HasMaxLength(50);
        builder.HasIndex(p => p.SKU).IsUnique();

        builder.Property(p => p.Stock).HasDefaultValue(0);
        builder.Property(p => p.IsActive).HasDefaultValue(true);
        builder.Property(p => p.CreatedAt).HasColumnType("datetime2");
        builder.Property(p => p.UpdatedAt).HasColumnType("datetime2");

        builder.HasMany(p => p.Lots)
            .WithOne(l => l.Product)
            .HasForeignKey(l => l.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
