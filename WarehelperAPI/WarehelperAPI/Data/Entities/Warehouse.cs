using FluentValidation;

using System.ComponentModel.DataAnnotations;
using System.Xml;
using WarehelperAPI.Auth.Model;

namespace WarehelperAPI.Data.Entities
{
    public class Warehouse
    {
        
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required int ItemCount { get; set; }

        public required string Type { get; set; }
        public required Company Company { get; set; }
        [Required]
        public required string UserId { get; set; }
        public WarehelperUser User { get; set; }
    }
    
    public record WarehouseDto(int Id, string Name, string Address, int ItemCount, string Type);
    public record ModifyWarehouseDto(string Name, string Address, string Type);
    public class WarehouseDtoValidator : AbstractValidator<ModifyWarehouseDto>
    {
     
        List<string> ValidTypes = new List<string>()
        {
            "Produkcija",
            "Žaliavos",
            "Paskirstymo centras",
            "Kita"
        };
        
        public WarehouseDtoValidator()
        {
           
            RuleFor(dto => dto.Name).NotEmpty().NotNull().Length(5, 30);
            RuleFor(dto => dto.Address).NotEmpty().NotNull().Length(1, 100);
            RuleFor(dto => dto.Type).Must(ValidTypes.Contains);
        }
    }
}
