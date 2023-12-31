﻿using O9d.AspNet.FluentValidation;
using WarehelperAPI.Data.Entities;
using WarehelperAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using WarehelperAPI.Auth.Model;
using Microsoft.AspNetCore.Identity;

namespace WarehelperAPI
{
    public class CompaniesEndpoints
    {
        public static void AddCompanyApi(RouteGroupBuilder companiesGroup) 
        {
            companiesGroup.MapGet("companies", async (WarehelperDbContext dbContext, CancellationToken token) =>
            {
                return (await dbContext.Companies.ToListAsync(token)).Select(obj =>
                    new CompanyDto(obj.Id, obj.Name, obj.RegistrationDate, obj.Address));
            });

            companiesGroup.MapGet("companies/{companyId:int}", async (int companyId, WarehelperDbContext dbContext) =>
            {
                Company company = await dbContext.Companies.FirstOrDefaultAsync<Company>(company => company.Id == companyId);
                if (company == null)
                {
                    return Results.NotFound();
                }
                return Results.Ok(new CompanyDto(company.Id, company.Name, company.RegistrationDate, company.Address));
            });

            companiesGroup.MapPost("companies", [Authorize(Roles = WarehelperRoles.Admin)]  async ([Validate] CreateCompanyDto createCompanyDto, HttpContext httpContext, WarehelperDbContext dbContext, UserManager<WarehelperUser> userManager) =>
            {
              

                Company c = await dbContext.Companies.FirstOrDefaultAsync<Company>(c => c.UserId == httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub));
                if (c != null)
                {
                    return Results.Forbid();
                }

                Company company = new Company()
                {
                    Name = createCompanyDto.Name,
                    Address = createCompanyDto.Address,
                    RegistrationDate = DateTime.Now,
                    UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                };
                
                var user = await userManager.FindByIdAsync(httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub));
               
                
                dbContext.Companies.Add(company);
                await dbContext.SaveChangesAsync();
                user.AssignedCompany = company.Id;
                await dbContext.SaveChangesAsync();

                return Results.Created($"/api/companies/{company.Id}", new CompanyDto(company.Id, company.Name, company.RegistrationDate, company.Address));
            });

            companiesGroup.MapPut("companies/{companyId:int}", [Authorize(Roles = WarehelperRoles.Admin)] async (HttpContext httpContext, int companyId, [Validate] UpdateCompanyDto updateCompanyDto, WarehelperDbContext dbContext) =>
            {

                Company company = await dbContext.Companies.FirstOrDefaultAsync<Company>(company => company.Id == companyId);
                if (company == null)
                {
                    return Results.NotFound();
                }

                if(httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != company.UserId)
                {
                    return Results.Forbid();
                }

                company.Address = updateCompanyDto.Address;
                dbContext.Update(company);

                await dbContext.SaveChangesAsync();
                return Results.Ok(new CompanyDto(company.Id, company.Name, company.RegistrationDate, company.Address));
            });

            companiesGroup.MapDelete("companies/{companyId:int}", [Authorize(Roles = WarehelperRoles.Admin)]  async (int companyId, HttpContext httpContext, WarehelperDbContext dbContext, UserManager<WarehelperUser> userManager) =>
            {
                
                Company company = await dbContext.Companies.FirstOrDefaultAsync<Company>(company => company.Id == companyId);
                if (company == null)
                {
                    return Results.NotFound();
                }

                if (httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != company.UserId)
                {
                    return Results.Forbid();
                }
                Console.WriteLine(string.Format("delete company id {0}", companyId));
                await userManager.Users.Where(user => user.AssignedCompany == companyId).ForEachAsync(user => user.AssignedCompany = null);
                dbContext.Remove(company);
              
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
