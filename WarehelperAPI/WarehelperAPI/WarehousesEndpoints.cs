using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using O9d.AspNet.FluentValidation;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using WarehelperAPI.Auth.Model;
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

            warehousesGroup.MapPost("warehouses", [Authorize(Roles = WarehelperRoles.Admin)]  async (int companyId,[Validate] ModifyWarehouseDto createWarehouseDto, HttpContext httpContext, WarehelperDbContext dbContext, UserManager<WarehelperUser> userManager) =>
            {

                Company company = await dbContext.Companies.FirstOrDefaultAsync<Company>(c => c.Id == companyId );

                if (company == null)
                {
                    return Results.NotFound();
                }

                if (httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != company.UserId) //cant create warehouse for another company
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
                    UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) //may not be used
                };
                
                dbContext.Warehouses.Add(warehouse);
                await dbContext.SaveChangesAsync();
                return Results.Created($"/api/companies/{companyId}/warehouses/{warehouse.Id}", new WarehouseDto(warehouse.Id, warehouse.Name, warehouse.Address, warehouse.ItemCount, warehouse.Type));
            });

            warehousesGroup.MapPut("warehouses/{warehouseId:int}", [Authorize(Roles = WarehelperRoles.Admin)] async (int companyId, int warehouseId, HttpContext httpContext, [Validate] ModifyWarehouseDto updateWarehouseDto, WarehelperDbContext dbContext) =>
            {
                Warehouse warehouse = await dbContext.Warehouses.Include(it => it.Company).FirstOrDefaultAsync<Warehouse>(wh => wh.Id == warehouseId && wh.Company.Id == companyId);
                if (warehouse == null)
                {
                    return Results.NotFound();
                }

                if (httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != warehouse.Company.UserId)
                {
                    return Results.Forbid();
                }

                warehouse.Address = updateWarehouseDto.Address;
                warehouse.Name = updateWarehouseDto.Name;
                warehouse.Type = updateWarehouseDto.Type;
                dbContext.Update(warehouse);

                await dbContext.SaveChangesAsync();
                return Results.Ok(new WarehouseDto(warehouse.Id, warehouse.Name, warehouse.Address, warehouse.ItemCount, warehouse.Type));
            });

            warehousesGroup.MapDelete("warehouses/{warehouseId:int}", [Authorize(Roles = WarehelperRoles.Admin)]  async (int companyId, int warehouseId, HttpContext httpContext,  WarehelperDbContext dbContext, UserManager<WarehelperUser> userManager ) =>
            {
                Warehouse warehouse = await dbContext.Warehouses.Include(it => it.Company).FirstOrDefaultAsync<Warehouse>(wh => wh.Id == warehouseId && wh.Company.Id == companyId);
                if (warehouse == null)
                {
                    return Results.NotFound();
                }
                if (httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != warehouse.Company.UserId)
                {
                    return Results.Forbid();
                }

                await userManager.Users.Where(user => user.AssignedCompany == companyId).ForEachAsync(user => user.AssignedWarehouse = default);
                dbContext.Remove(warehouse);
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            });

            warehousesGroup.MapPut("warehouses/{warehouseId:int}/addWorker", [Authorize(Roles = WarehelperRoles.Admin)] async (int companyId, int warehouseId, HttpContext httpContext, UserManager < WarehelperUser> userManager, [Validate] SetUserDto setDto, WarehelperDbContext dbContext) =>
            {

                var user = await userManager.FindByNameAsync(setDto.UserName);
                if (user == null)
                {
                    return Results.NotFound("User not registered");
                }

                Warehouse warehouse = await dbContext.Warehouses.Include(it => it.Company).FirstOrDefaultAsync<Warehouse>(wh => wh.Company.Id == companyId && wh.Id == warehouseId);
                if(warehouse == null)
                {
                    return Results.NotFound();
                }

                if (httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != warehouse.Company.UserId)
                {
                    return Results.Forbid();
                }

                if(user.AssignedCompany != default && user.AssignedCompany != warehouse.Company.Id)
                {
                    return Results.Forbid();
                }


                await dbContext.SaveChangesAsync();

                user.AssignedWarehouse = warehouseId;
                user.AssignedCompany = companyId;

                await dbContext.SaveChangesAsync();

                return Results.Ok(new SetUserDto(UserName: setDto.UserName));
             

            });
        }
        public record SetUserDto(string UserName);
        public class SetWarehouseValidator : AbstractValidator<SetUserDto>
        {
            public SetWarehouseValidator()
            {
                RuleFor(dto => dto.UserName).NotEmpty().NotNull();
            }
        }
    }
}
