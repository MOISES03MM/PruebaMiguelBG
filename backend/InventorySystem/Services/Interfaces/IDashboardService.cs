using InventorySystem.DTOs;

namespace InventorySystem.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync();
}
