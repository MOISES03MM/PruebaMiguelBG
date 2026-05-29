using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventorySystem.Migrations
{
    /// <inheritdoc />
    public partial class UniqueLotNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductLots_LotNumber",
                table: "ProductLots");

            migrationBuilder.CreateIndex(
                name: "IX_ProductLots_LotNumber",
                table: "ProductLots",
                column: "LotNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductLots_LotNumber",
                table: "ProductLots");

            migrationBuilder.CreateIndex(
                name: "IX_ProductLots_LotNumber",
                table: "ProductLots",
                column: "LotNumber");
        }
    }
}
