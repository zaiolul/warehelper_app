using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WarehelperAPI.Migrations
{
    /// <inheritdoc />
    public partial class warehouse_field : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedWarehouse",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedWarehouse",
                table: "AspNetUsers");
        }
    }
}
