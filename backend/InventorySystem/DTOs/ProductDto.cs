using System.ComponentModel.DataAnnotations;

namespace InventorySystem.DTOs;

public class ProductResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public int Stock { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ProductLotResponseDto> Lots { get; set; } = new();
}

public class CreateProductDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string SKU { get; set; } = string.Empty;

    public int Stock { get; set; }
}

public class UpdateProductDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string SKU { get; set; } = string.Empty;

    public int Stock { get; set; }
}

public class ProductLotResponseDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string LotNumber { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime EntryDate { get; set; }
    public int Quantity { get; set; }
    public string? Notes { get; set; }
}

public class CreateProductLotDto
{
    [Required, MaxLength(50)]
    public string LotNumber { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    public DateTime EntryDate { get; set; } = DateTime.UtcNow;

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [MaxLength(300)]
    public string? Notes { get; set; }
}

public class UpdateProductLotDto
{
    [Required, MaxLength(50)]
    public string LotNumber { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    public DateTime EntryDate { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [MaxLength(300)]
    public string? Notes { get; set; }
}

public class PaginatedResponseDto<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
