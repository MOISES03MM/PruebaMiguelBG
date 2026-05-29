namespace InventorySystem.DTOs;

public class DashboardStatsDto
{
    public int TotalProducts { get; set; }
    public int TotalLots { get; set; }
    public int LowStockProducts { get; set; }
    public int OutOfStockProducts { get; set; }
    public List<CategoryCountDto> ProductsByCategory { get; set; } = new();
    public List<RecentLotDto> RecentLots { get; set; } = new();
}

public class CategoryCountDto
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class RecentLotDto
{
    public string ProductName { get; set; } = string.Empty;
    public string LotNumber { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public DateTime EntryDate { get; set; }
}
