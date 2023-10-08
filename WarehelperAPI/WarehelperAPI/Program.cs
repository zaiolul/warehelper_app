using FluentValidation;
using Google.Protobuf.WellKnownTypes;
using Microsoft.EntityFrameworkCore;
using O9d.AspNet.FluentValidation;
using WarehelperAPI;
using WarehelperAPI.Data;
using WarehelperAPI.Data.Entities;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<WarehelperDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
var app = builder.Build();

var companiesGroup = app.MapGroup("/api").WithValidationFilter();
CompaniesEndpoints.AddCompanyApi(companiesGroup);

var warehousesGroup = app.MapGroup("/api/companies/{companyId}").WithValidationFilter();
WarehousesEndpoints.AddWarehousesApi(warehousesGroup);

var itemsGroup = app.MapGroup("/api/companies/{companyId}/warehouses/{warehouseId}").WithValidationFilter();
ItemsEndpoints.AddItemsApi(itemsGroup);


app.Run();


