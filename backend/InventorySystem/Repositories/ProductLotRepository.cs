using InventorySystem.Data;
using InventorySystem.Models;
using InventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Repositories;

public class ProductLotRepository : IProductLotRepository
{
    private readonly AppDbContext _context;

    public ProductLotRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductLot>> GetByProductIdAsync(Guid productId)
    {
        return await _context.ProductLots
            .Where(l => l.ProductId == productId)
            .OrderByDescending(l => l.EntryDate)
            .ToListAsync();
    }

    public async Task<ProductLot?> GetByIdAsync(Guid id)
    {
        return await _context.ProductLots.FindAsync(id);
    }

    public async Task<ProductLot> CreateAsync(ProductLot lot)
    {
        _context.ProductLots.Add(lot);
        await _context.SaveChangesAsync();
        return lot;
    }

    public async Task UpdateAsync(ProductLot lot)
    {
        _context.ProductLots.Update(lot);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(ProductLot lot)
    {
        _context.ProductLots.Remove(lot);
        await _context.SaveChangesAsync();
    }
}
