using InventorySystem.Data;
using InventorySystem.Models;
using InventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(List<Product> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, string? name, string? category, string? sku)
    {
        var query = _context.Products
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(p => p.Name.Contains(name));

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(p => p.Category.Contains(category));

        if (!string.IsNullOrWhiteSpace(sku))
            query = query.Where(p => p.SKU.Contains(sku));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(p => p.Lots)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products
            .Include(p => p.Lots)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
    }

    public async Task<Product?> GetBySkuAsync(string sku)
    {
        return await _context.Products
            .FirstOrDefaultAsync(p => p.SKU == sku && p.IsActive);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Products.AnyAsync(p => p.Id == id && p.IsActive);
    }
}
