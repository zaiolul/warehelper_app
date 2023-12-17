using FluentValidation;
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
using Microsoft.AspNetCore.Builder;

//adminas - gali sukurti įmonę, sandėlius įmonėje, registruoti darbuotojus į sandėlius
//darbuotojas - modifikuoti daiktus jam priskirtam sandelyje

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // parsint roles ir kitas info user

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options =>
{
    //options.AddPolicy("CORSPolicy", builder =>
    //{
    //    builder.AllowAnyMethod()
    //    .AllowAnyHeader()
    //    .WithOrigins("http://localhost:3000", "https://warehelper.azurewebsites.net");
    //});
    options.AddPolicy("CORSPolicy", builder =>
    {
        builder.AllowAnyMethod()
        .AllowAnyHeader()
        .WithOrigins("http://localhost:3000", "https://warehelper.azurewebsites.net");
    });
});
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
    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt_Secret"]));
    options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt_ValidIssuer"];
    options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt_ValidAudience"];
});

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseCors("CORSPolicy");
app.UseHttpsRedirection();


app.UseStatusCodePages(async statusCodeContext
    => await Results.Problem(statusCode: statusCodeContext.HttpContext.Response.StatusCode, title: "problem", detail: "Request couldn't complete successfully")
                 .ExecuteAsync(statusCodeContext.HttpContext));

app.UseAuthentication();
app.UseAuthorization();
app.AddAuthApi();

var companiesGroup = app.MapGroup("/api").WithValidationFilter();
CompaniesEndpoints.AddCompanyApi(companiesGroup);

var warehousesGroup = app.MapGroup("/api/companies/{companyId:int}").WithValidationFilter();
WarehousesEndpoints.AddWarehousesApi(warehousesGroup);

var itemsGroup = app.MapGroup("/api/companies/{companyId:int}/warehouses/{warehouseId:int}").WithValidationFilter();
ItemsEndpoints.AddItemsApi(itemsGroup);


using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetService<WarehelperDbContext>();
dbContext.Database.Migrate();

var dbSeeder = scope.ServiceProvider.GetRequiredService<AuthDbSeeder>();
await dbSeeder.SeedAsync();

app.Run();


