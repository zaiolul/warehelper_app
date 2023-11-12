using FluentValidation;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using O9d.AspNet.FluentValidation;
using WarehelperAPI;
using WarehelperAPI.Data;
using System.Text;
using Microsoft.AspNetCore.Identity;
using WarehelperAPI.Auth.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using WarehelperAPI.Auth;

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // parsint roles ir kitas info user

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<WarehelperDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddTransient<JwtTokenService>();
builder.Services.AddScoped<AuthDbSeeder>();
//builder.Services.AddIdentity<WarehelperUser, IdentityRole>().AddEntityFrameworkStores<WarehelperDbContext>().AddDefaultTokenProviders();

builder.Services.AddIdentity<WarehelperUser, IdentityRole>().
    AddEntityFrameworkStores<WarehelperDbContext>().
    AddDefaultTokenProviders();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; 
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]));
    options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:ValidIssuer"];
    options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:ValidAudience"];
});

builder.Services.AddAuthorization();

var app = builder.Build();



app.UseStatusCodePages(async statusCodeContext
    => await Results.Problem(statusCode: statusCodeContext.HttpContext.Response.StatusCode, title: "Bad input", detail: "Could not parse request body.")
                 .ExecuteAsync(statusCodeContext.HttpContext));

var companiesGroup = app.MapGroup("/api").WithValidationFilter();
CompaniesEndpoints.AddCompanyApi(companiesGroup);

var warehousesGroup = app.MapGroup("/api/companies/{companyId:int}").WithValidationFilter();
WarehousesEndpoints.AddWarehousesApi(warehousesGroup);

var itemsGroup = app.MapGroup("/api/companies/{companyId:int}/warehouses/{warehouseId:int}").WithValidationFilter();
ItemsEndpoints.AddItemsApi(itemsGroup);

app.AddAuthApi();
app.UseAuthentication();
app.UseAuthorization();

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetService<WarehelperDbContext>();
dbContext.Database.Migrate();

var dbSeeder = scope.ServiceProvider.GetRequiredService<AuthDbSeeder>();
await dbSeeder.SeedAsync();



app.Run();


