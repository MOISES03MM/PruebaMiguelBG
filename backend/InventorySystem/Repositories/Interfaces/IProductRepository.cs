using InventorySystem.Models;

namespace InventorySystem.Repositories.Interfaces;

public interface IProductRepository
{
    Task<(List<Product> Items, int TotalCount)> GetAllAsync(int page, int pageSize, string? name, string? category, string? sku);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product?> GetBySkuAsync(string sku);
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(Product product);
    Task<bool> ExistsAsync(Guid id);
}
