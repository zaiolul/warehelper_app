using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WarehelperAPI.Migrations
{
    /// <inheritdoc />
    public partial class companyid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedCompany",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedCompany",
                table: "AspNetUsers");
        }
    }
}
