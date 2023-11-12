using Microsoft.EntityFrameworkCore;
using O9d.AspNet.FluentValidation;
using System.ComponentModel.Design;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading;
using WarehelperAPI.Data;
using WarehelperAPI.Data.Entities;

namespace WarehelperAPI
{
    public class WarehousesEndpoints
    {
        public static void AddWarehousesApi(RouteGroupBuilder warehousesGroup) 
        {
            warehousesGroup.MapGet("warehouses", async (int companyId, WarehelperDbContext dbContext, CancellationToken cancellationToken) =>
            {
             
                return (await dbContext.Warehouses.Include(obj => obj.Company).ToListAsync(cancellationToken)).Where(obj => obj.Company.Id == companyId).Select(obj =>
                        new WarehouseDto(obj.Id, obj.Name, obj.Address, obj.ItemCount, obj.Type));

            });

            warehousesGroup.MapGet("warehouses/{warehouseId:int}", async (int companyId, int warehouseId, WarehelperDbContext dbContext) =>
            {
                
                Warehouse warehouse = await dbContext.Warehouses.FirstOrDefaultAsync<Warehouse>(wh => wh.Company.Id == companyId && wh.Id == warehouseId );
                if(warehouse == null)
                {
                    return Results.NotFound();
                }
                return Results.Ok(new WarehouseDto(warehouse.Id,warehouse.Name, warehouse.Address, warehouse.ItemCount, warehouse.Type));
            });

            warehousesGroup.MapPost("warehouses", async (int companyId,[Validate] ModifyWarehouseDto createWarehouseDto, HttpContext httpContext, WarehelperDbContext dbContext) =>
            {

                Company company = await dbContext.Companies.FirstOrDefaultAsync<Company>(c => c.Id == companyId );

                if (company == null)
                {
                    return Results.NotFound();
                }

                Warehouse warehouse = new Warehouse()
                {
                    Name = createWarehouseDto.Name,
                    Address = createWarehouseDto.Address,
                    Type = createWarehouseDto.Type,
                    ItemCount = 0,
                    Company = company,
                    UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                };

                dbContext.Warehouses.Add(warehouse);
                await dbContext.SaveChangesAsync();
                return Results.Created($"/api/companies/{companyId}/warehouses/{warehouse.Id}", new WarehouseDto(warehouse.Id, warehouse.Name, warehouse.Address, warehouse.ItemCount, warehouse.Type));
            });

            warehousesGroup.MapPut("warehouses/{warehouseId:int}", async (int companyId, int warehouseId,[Validate] ModifyWarehouseDto updateWarehouseDto, WarehelperDbContext dbContext) =>
            {
                Warehouse warehouse = await dbContext.Warehouses.FirstOrDefaultAsync<Warehouse>(wh => wh.Id == warehouseId && wh.Company.Id == companyId);
                if (warehouse == null)
                {
                    return Results.NotFound();
                }

                warehouse.Address = updateWarehouseDto.Address;
                warehouse.Name = updateWarehouseDto.Name;
                warehouse.Type = updateWarehouseDto.Type;
                dbContext.Update(warehouse);

                await dbContext.SaveChangesAsync();
                return Results.Ok(new WarehouseDto(warehouse.Id, warehouse.Name, warehouse.Address, warehouse.ItemCount, warehouse.Type));
            });

            warehousesGroup.MapDelete("warehouses/{warehouseId:int}", async (int companyId, int warehouseId, WarehelperDbContext dbContext) =>
            {
                Warehouse warehouse = await dbContext.Warehouses.FirstOrDefaultAsync<Warehouse>(wh => wh.Id == warehouseId && wh.Company.Id == companyId);
                if (warehouse == null)
                {
                    return Results.NotFound();
                }
                dbContext.Remove(warehouse);
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
