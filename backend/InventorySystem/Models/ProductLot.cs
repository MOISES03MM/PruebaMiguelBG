namespace InventorySystem.Models;

public class ProductLot
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string LotNumber { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime EntryDate { get; set; } = DateTime.UtcNow;
    public int Quantity { get; set; }
    public string? Notes { get; set; }

    public Product Product { get; set; } = null!;
}
