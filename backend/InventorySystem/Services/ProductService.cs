using InventorySystem.DTOs;
using InventorySystem.Models;
using InventorySystem.Repositories.Interfaces;
using InventorySystem.Services.Interfaces;

namespace InventorySystem.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IProductLotRepository _lotRepository;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        IProductRepository productRepository,
        IProductLotRepository lotRepository,
        ILogger<ProductService> logger)
    {
        _productRepository = productRepository;
        _lotRepository = lotRepository;
        _logger = logger;
    }

    public async Task<PaginatedResponseDto<ProductResponseDto>> GetAllAsync(
        int page, int pageSize, string? name, string? category, string? sku)
    {
        var (items, totalCount) = await _productRepository.GetAllAsync(page, pageSize, name, category, sku);

        return new PaginatedResponseDto<ProductResponseDto>
        {
            Data = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    public async Task<ProductResponseDto?> GetByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product == null ? null : MapToDto(product);
    }

    public async Task<ProductResponseDto> CreateAsync(CreateProductDto dto)
    {
        var existing = await _productRepository.GetBySkuAsync(dto.SKU);
        if (existing != null)
            throw new InvalidOperationException($"Ya existe un producto con SKU '{dto.SKU}'");

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            SKU = dto.SKU,
            Stock = dto.Stock,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _productRepository.CreateAsync(product);
        _logger.LogInformation("Product created: {ProductId} - {SKU}", product.Id, product.SKU);

        return MapToDto(product);
    }

    public async Task<ProductResponseDto?> UpdateAsync(Guid id, UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return null;

        var skuConflict = await _productRepository.GetBySkuAsync(dto.SKU);
        if (skuConflict != null && skuConflict.Id != id)
            throw new InvalidOperationException($"Ya existe otro producto con SKU '{dto.SKU}'");

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Category = dto.Category;
        product.SKU = dto.SKU;
        product.Stock = dto.Stock;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);
        _logger.LogInformation("Product updated: {ProductId}", product.Id);

        return MapToDto(product);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return false;

        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);
        _logger.LogInformation("Product soft-deleted: {ProductId}", product.Id);

        return true;
    }

    public async Task<List<ProductLotResponseDto>> GetLotsAsync(Guid productId)
    {
        var lots = await _lotRepository.GetByProductIdAsync(productId);
        return lots.Select(MapLotToDto).ToList();
    }

    public async Task<ProductLotResponseDto?> CreateLotAsync(Guid productId, CreateProductLotDto dto)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return null;

        var lots = await _lotRepository.GetByProductIdAsync(productId);
        var assignedQuantity = lots.Sum(l => l.Quantity);
        var available = product.Stock - assignedQuantity;

        if (dto.Quantity > available)
            throw new InvalidOperationException(
                $"Stock insuficiente. Disponible: {available}, solicitado: {dto.Quantity}");

        var lot = new ProductLot
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            LotNumber = dto.LotNumber,
            Price = dto.Price,
            EntryDate = dto.EntryDate,
            Quantity = dto.Quantity,
            Notes = dto.Notes
        };

        await _lotRepository.CreateAsync(lot);
        _logger.LogInformation("Lot created: {LotId} for product {ProductId}", lot.Id, productId);

        return MapLotToDto(lot);
    }

    public async Task<ProductLotResponseDto?> UpdateLotAsync(Guid productId, Guid lotId, UpdateProductLotDto dto)
    {
        var lot = await _lotRepository.GetByIdAsync(lotId);
        if (lot == null || lot.ProductId != productId) return null;

        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return null;

        var lots = await _lotRepository.GetByProductIdAsync(productId);
        var assignedQuantity = lots.Where(l => l.Id != lotId).Sum(l => l.Quantity);
        var available = product.Stock - assignedQuantity;

        if (dto.Quantity > available)
            throw new InvalidOperationException(
                $"Stock insuficiente. Disponible: {available}, solicitado: {dto.Quantity}");

        lot.LotNumber = dto.LotNumber;
        lot.Price = dto.Price;
        lot.EntryDate = dto.EntryDate;
        lot.Quantity = dto.Quantity;
        lot.Notes = dto.Notes;

        await _lotRepository.UpdateAsync(lot);
        _logger.LogInformation("Lot updated: {LotId}", lotId);

        return MapLotToDto(lot);
    }

    public async Task<bool> DeleteLotAsync(Guid productId, Guid lotId)
    {
        var lot = await _lotRepository.GetByIdAsync(lotId);
        if (lot == null || lot.ProductId != productId) return false;

        await _lotRepository.DeleteAsync(lot);
        _logger.LogInformation("Lot deleted: {LotId}", lotId);

        return true;
    }

    private static ProductResponseDto MapToDto(Product product)
    {
        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Category = product.Category,
            SKU = product.SKU,
            Stock = product.Stock,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            Lots = product.Lots?.Select(MapLotToDto).ToList() ?? new()
        };
    }

    private static ProductLotResponseDto MapLotToDto(ProductLot lot)
    {
        return new ProductLotResponseDto
        {
            Id = lot.Id,
            ProductId = lot.ProductId,
            LotNumber = lot.LotNumber,
            Price = lot.Price,
            EntryDate = lot.EntryDate,
            Quantity = lot.Quantity,
            Notes = lot.Notes
        };
    }
}
