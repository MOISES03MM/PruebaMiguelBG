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

public static class ProductCategories
{
    public const string Electronica = "Electronica";
    public const string Muebles     = "Muebles";
    public const string Ropa        = "Ropa";
    public const string Calzado     = "Calzado";
    public const string Alimentos   = "Alimentos";
    public const string Bebidas     = "Bebidas";
    public const string Herramientas = "Herramientas";
    public const string Papeleria   = "Papeleria";
    public const string Limpieza    = "Limpieza";
    public const string Deportes    = "Deportes";
    public const string Juguetes    = "Juguetes";
    public const string Otros       = "Otros";

    public static readonly string[] All =
    [
        Electronica, Muebles, Ropa, Calzado, Alimentos,
        Bebidas, Herramientas, Papeleria, Limpieza, Deportes, Juguetes, Otros
    ];
}

public class CreateProductDto
{
    [Required, MaxLength(200)]
    [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$",
        ErrorMessage = "Solo se permiten letras y números.")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]*$",
        ErrorMessage = "Solo se permiten letras y números.")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [AllowedValues("Electronica", "Muebles", "Ropa", "Calzado", "Alimentos",
                   "Bebidas", "Herramientas", "Papeleria", "Limpieza",
                   "Deportes", "Juguetes", "Otros",
                   ErrorMessage = "Categoría no válida.")]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    [RegularExpression(@"^[a-zA-Z0-9]+$",
        ErrorMessage = "Solo se permiten letras y números.")]
    public string SKU { get; set; } = string.Empty;

    public int Stock { get; set; }
}

public class UpdateProductDto
{
    [Required, MaxLength(200)]
    [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$",
        ErrorMessage = "Solo se permiten letras y números.")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]*$",
        ErrorMessage = "Solo se permiten letras y números.")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [AllowedValues("Electronica", "Muebles", "Ropa", "Calzado", "Alimentos",
                   "Bebidas", "Herramientas", "Papeleria", "Limpieza",
                   "Deportes", "Juguetes", "Otros",
                   ErrorMessage = "Categoría no válida.")]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    [RegularExpression(@"^[a-zA-Z0-9]+$",
        ErrorMessage = "Solo se permiten letras y números.")]
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
    [RegularExpression(@"^[a-zA-Z0-9\-]+$",
        ErrorMessage = "Solo se permiten letras, números y guion medio.")]
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
    [RegularExpression(@"^[a-zA-Z0-9\-]+$",
        ErrorMessage = "Solo se permiten letras, números y guion medio.")]
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
