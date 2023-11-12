using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using O9d.AspNet.FluentValidation;
using System.ComponentModel.Design;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WarehelperAPI.Data;
using WarehelperAPI.Data.Entities;

namespace WarehelperAPI
{
    public class ItemsEndpoints
    {
        public static void AddItemsApi(RouteGroupBuilder itemsGroup)
        {
            itemsGroup.MapGet("items", async (int companyId, int warehouseId, WarehelperDbContext dbContext, CancellationToken cancellationToken) =>
            {
                return (await dbContext.Items.Include(obj => obj.Warehouse).Include(obj => obj.Warehouse.Company).ToListAsync(cancellationToken)).Where(obj
                    => obj.Warehouse.Company.Id == companyId && obj.Warehouse.Id == warehouseId).Select(obj =>
                       new ItemDto(obj.Id, obj.Name, obj.Category, obj.Description, obj.LastUpdateTime));
            });

            itemsGroup.MapGet("items/{itemId:int}", async (int companyId, int warehouseId, int itemId, WarehelperDbContext dbContext) =>
            {
                Item item = await dbContext.Items.FirstOrDefaultAsync<Item>(it => it.Id == itemId && it.Warehouse.Id == warehouseId && it.Warehouse.Company.Id == companyId);
                if (item == null)
                {
                    return Results.NotFound();
                }
                return Results.Ok(new ItemDto(item.Id, item.Name, item.Category, item.Description, item.LastUpdateTime));
            });

            itemsGroup.MapPost("items", async (int companyId, int warehouseId, [Validate] CreateItemDto createItemDto, HttpContext httpContext, WarehelperDbContext dbContext) =>
            {

                Warehouse warehouse = await dbContext.Warehouses.FirstOrDefaultAsync<Warehouse>(wh => wh.Id == warehouseId && wh.Company.Id == companyId);

                if (warehouse == null)
                {
                    return Results.NotFound();
                }

                Item item = new Item()
                {
                    Name = createItemDto.Name,
                    Category = createItemDto.Category,
                    Description = createItemDto.Description,

                    LastUpdateTime = DateTime.UtcNow,
                    Warehouse = warehouse,
                    UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                };
                item.Warehouse.ItemCount++;
                dbContext.Items.Add(item);
                await dbContext.SaveChangesAsync();
                return Results.Created($"/api/companies/{companyId}/warehouses/{warehouseId}/items/{item.Id}",
                    new ItemDto(item.Id, item.Name, item.Category, item.Description, item.LastUpdateTime));
            });

            itemsGroup.MapPut("items/{itemId:int}", async (int companyId, int warehouseId, int itemId, UpdateItemDto updateItemDto,WarehelperDbContext dbContext) =>
            {
                Item item = await dbContext.Items.Include(it => it.Warehouse).Include(it => it.Warehouse.Company).FirstOrDefaultAsync<Item>(it => it.Id == itemId && it.Warehouse.Id == warehouseId && it.Warehouse.Company.Id == companyId);
                if (item == null)
                {
                    return Results.NotFound();
                }

                item.Description = updateItemDto.Description;
                item.LastUpdateTime = DateTime.Now;
                dbContext.Update(item);

                await dbContext.SaveChangesAsync();
                return Results.Ok(new ItemDto(item.Id, item.Name, item.Category, item.Description, item.LastUpdateTime));
            });

            itemsGroup.MapDelete("items/{itemId:int}", async (int companyId, int warehouseId, int itemId, WarehelperDbContext dbContext) =>
            {
                Item item = await dbContext.Items.Include(it =>it.Warehouse).Include(it =>it.Warehouse.Company).FirstOrDefaultAsync<Item>(it => it.Id == itemId && it.Warehouse.Id == warehouseId && it.Warehouse.Company.Id == companyId);
                if (item == null)
                {
                    return Results.NotFound();
                }

                
                item.Warehouse.ItemCount--;
                dbContext.Remove(item);
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
