using InventorySystem.Models;

namespace InventorySystem.Repositories.Interfaces;

public interface IProductLotRepository
{
    Task<List<ProductLot>> GetByProductIdAsync(Guid productId);
    Task<ProductLot?> GetByIdAsync(Guid id);
    Task<ProductLot> CreateAsync(ProductLot lot);
    Task UpdateAsync(ProductLot lot);
    Task DeleteAsync(ProductLot lot);
}
