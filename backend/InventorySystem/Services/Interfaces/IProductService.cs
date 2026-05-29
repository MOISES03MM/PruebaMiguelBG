using InventorySystem.DTOs;

namespace InventorySystem.Services.Interfaces;

public interface IProductService
{
    Task<PaginatedResponseDto<ProductResponseDto>> GetAllAsync(int page, int pageSize, string? name, string? category, string? sku);
    Task<ProductResponseDto?> GetByIdAsync(Guid id);
    Task<ProductResponseDto> CreateAsync(CreateProductDto dto);
    Task<ProductResponseDto?> UpdateAsync(Guid id, UpdateProductDto dto);
    Task<bool> DeleteAsync(Guid id);

    Task<List<ProductLotResponseDto>> GetLotsAsync(Guid productId);
    Task<ProductLotResponseDto?> CreateLotAsync(Guid productId, CreateProductLotDto dto);
    Task<ProductLotResponseDto?> UpdateLotAsync(Guid productId, Guid lotId, UpdateProductLotDto dto);
    Task<bool> DeleteLotAsync(Guid productId, Guid lotId);
}
