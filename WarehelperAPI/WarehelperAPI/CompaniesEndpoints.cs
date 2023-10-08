using O9d.AspNet.FluentValidation;
using WarehelperAPI.Data.Entities;
using WarehelperAPI.Data;
using Microsoft.EntityFrameworkCore;

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

            companiesGroup.MapGet("companies/{companyId}", async (int companyId, WarehelperDbContext dbContext) =>
            {
                Company company = await dbContext.Companies.FirstOrDefaultAsync<Company>(company => company.Id == companyId);
                if (company == null)
                {
                    return Results.NotFound();
                }
                return Results.Ok(new CompanyDto(company.Id, company.Name, company.RegistrationDate, company.Address));
            });

            companiesGroup.MapPost("companies", async ([Validate] CreateCompanyDto createCompanyDto, WarehelperDbContext dbContext) =>
            {
                Console.WriteLine(string.Format("{0}, {1}", createCompanyDto.Name, createCompanyDto.Address));
                Company company = new Company()
                {
                    Name = createCompanyDto.Name,
                    Address = createCompanyDto.Address,
                    RegistrationDate = DateTime.Now
                };

                dbContext.Companies.Add(company);
                await dbContext.SaveChangesAsync();
                return Results.Created($"/api/companies/{company.Id}", new CompanyDto(company.Id, company.Name, company.RegistrationDate, company.Address));
            });

            companiesGroup.MapPut("companies/{companyId}", async (int companyId, [Validate] UpdateCompanyDto updateCompanyDto, WarehelperDbContext dbContext) =>
            {
                Company company = await dbContext.Companies.FirstOrDefaultAsync<Company>(company => company.Id == companyId);
                if (company == null)
                {
                    return Results.NotFound();
                }

                company.Address = updateCompanyDto.Address;
                dbContext.Update(company);

                await dbContext.SaveChangesAsync();
                return Results.Ok(new CompanyDto(company.Id, company.Name, company.RegistrationDate, company.Address));

            });

            companiesGroup.MapDelete("companies/{companyId}", async (int companyId, WarehelperDbContext dbContext) =>
            {
                Company company = await dbContext.Companies.FirstOrDefaultAsync<Company>(company => company.Id == companyId);
                if (company == null)
                {
                    return Results.NotFound();
                }
                dbContext.Remove(company);

                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
