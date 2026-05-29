using InventorySystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InventorySystem.Data.Configurations;

public class ProductLotConfiguration : IEntityTypeConfiguration<ProductLot>
{
    public void Configure(EntityTypeBuilder<ProductLot> builder)
    {
        builder.ToTable("ProductLots");

        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id).HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(l => l.LotNumber).IsRequired().HasMaxLength(50);
        builder.Property(l => l.Price).HasColumnType("decimal(18,2)");
        builder.Property(l => l.EntryDate).HasColumnType("datetime2");
        builder.Property(l => l.Quantity).IsRequired();
        builder.Property(l => l.Notes).HasMaxLength(300);

        builder.HasIndex(l => l.LotNumber).IsUnique();
    }
}
