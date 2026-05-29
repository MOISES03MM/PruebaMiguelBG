using InventorySystem.DTOs;
using InventorySystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? name = null,
        [FromQuery] string? category = null,
        [FromQuery] string? sku = null)
    {
        var result = await _productService.GetAllAsync(page, pageSize, name, category, sku);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        try
        {
            var product = await _productService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto)
    {
        try
        {
            var product = await _productService.UpdateAsync(id, dto);
            if (product == null) return NotFound();
            return Ok(product);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _productService.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("{id:guid}/lots")]
    public async Task<IActionResult> GetLots(Guid id)
    {
        var lots = await _productService.GetLotsAsync(id);
        return Ok(lots);
    }

    [HttpPost("{id:guid}/lots")]
    public async Task<IActionResult> CreateLot(Guid id, [FromBody] CreateProductLotDto dto)
    {
        try
        {
            var lot = await _productService.CreateLotAsync(id, dto);
            if (lot == null) return NotFound();
            return Created("", lot);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}/lots/{lotId:guid}")]
    public async Task<IActionResult> UpdateLot(Guid id, Guid lotId, [FromBody] UpdateProductLotDto dto)
    {
        try
        {
            var lot = await _productService.UpdateLotAsync(id, lotId, dto);
            if (lot == null) return NotFound();
            return Ok(lot);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}/lots/{lotId:guid}")]
    public async Task<IActionResult> DeleteLot(Guid id, Guid lotId)
    {
        var result = await _productService.DeleteLotAsync(id, lotId);
        if (!result) return NotFound();
        return NoContent();
    }
}
