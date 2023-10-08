using FluentValidation;

namespace WarehelperAPI.Data.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required DateTime RegistrationDate { get; set; }
        public required string Address { get; set; }
    }

    public record CompanyDto(int Id, string Name, DateTime RegistrationDate, string Address);
    public record CreateCompanyDto(string Name, string Address);
    public record UpdateCompanyDto(string Address);

    public class CreateCompanyDtoValidator : AbstractValidator<CreateCompanyDto>
    {
        public CreateCompanyDtoValidator()
        {
            RuleFor(dto => dto.Name).NotEmpty().NotNull().Length(5, 30);
            RuleFor(dto => dto.Address).NotEmpty().NotNull().Length(1, 100);
        }
    }

    public class UpdateCompanyDtoValidator : AbstractValidator<UpdateCompanyDto>
    {
        public UpdateCompanyDtoValidator()
        {
            RuleFor(dto => dto.Address).NotEmpty().Length(1, 100);
        }
    }

}
