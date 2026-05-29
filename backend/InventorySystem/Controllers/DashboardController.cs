using InventorySystem.Data;
using InventorySystem.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var products = _context.Products.Where(p => p.IsActive).AsNoTracking();

        var totalProducts = await products.CountAsync();
        var totalLots = await _context.ProductLots.CountAsync();
        var lowStockProducts = await products.CountAsync(p => p.Stock > 0 && p.Stock <= 5);
        var outOfStockProducts = await products.CountAsync(p => p.Stock == 0);

        var productsByCategory = await products
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

        return Ok(new DashboardStatsDto
        {
            TotalProducts = totalProducts,
            TotalLots = totalLots,
            LowStockProducts = lowStockProducts,
            OutOfStockProducts = outOfStockProducts,
            ProductsByCategory = productsByCategory,
            RecentLots = recentLots
        });
    }
}
