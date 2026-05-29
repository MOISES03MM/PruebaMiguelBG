using InventorySystem.DTOs;

namespace InventorySystem.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
    Task<UserDto?> GetCurrentUserAsync(Guid userId);
}
