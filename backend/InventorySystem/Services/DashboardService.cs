using InventorySystem.Data;
using InventorySystem.DTOs;
using InventorySystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var activeProducts = _context.Products.Where(p => p.IsActive).AsNoTracking();
        var totalProducts = await activeProducts.CountAsync();
        var totalLots = await _context.ProductLots.AsNoTracking().CountAsync();
        var lowStockProducts = await activeProducts.CountAsync(p => p.Stock > 0 && p.Stock <= 5);
        var outOfStockProducts = await activeProducts.CountAsync(p => p.Stock == 0);

        var productsByCategory = await activeProducts
            .GroupBy(p => p.Category)
            .Select(g => new CategoryCountDto { Category = g.Key, Count = g.Count() })
            .OrderByDescending(c => c.Count)
            .ToListAsync();

        var recentLots = await _context.ProductLots
            .AsNoTracking()
            .Include(l => l.Product)
            .Where(l => l.Product.IsActive)
            .OrderByDescending(l => l.EntryDate)
            .Take(5)
            .Select(l => new RecentLotDto
            {
                ProductName = l.Product.Name,
                LotNumber = l.LotNumber,
                Quantity = l.Quantity,
                Price = l.Price,
                EntryDate = l.EntryDate
            })
            .ToListAsync();

        return new DashboardStatsDto
        {
            TotalProducts = totalProducts,
            TotalLots = totalLots,
            LowStockProducts = lowStockProducts,
            OutOfStockProducts = outOfStockProducts,
            ProductsByCategory = productsByCategory,
            RecentLots = recentLots
        };
    }
}
