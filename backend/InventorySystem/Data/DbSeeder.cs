using InventorySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        var users = new List<User>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                Email = "admin@inventory.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                Username = "viewer",
                Email = "viewer@inventory.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("viewer123"),
                Role = "Viewer",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }
}
