
using FluentValidation;
using System.ComponentModel.DataAnnotations;
using WarehelperAPI.Auth.Model;

namespace WarehelperAPI.Data.Entities
{
    public class Item
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Category { get; set; }
        public string? Description { get; set; }
        public required DateTime LastUpdateTime { get; set; }
        public required Warehouse Warehouse { get; set; }
        [Required]
        public required string UserId { get; set; }
        public WarehelperUser User { get; set; }
    }

    public record ItemDto(int Id, string Name, string Category, string? Description, DateTime LastUpdateTime);
    
    public record CreateItemDto(string Name, string Category, string? Description);
    public record UpdateItemDto(string? Description);
    public class CreateItemDtoValidator : AbstractValidator<CreateItemDto>
    {

        List<string> ValidCategories = new List<string>()
        {
            "Elektronika",
            "Biuro įranga",
            "Baldai",
            "Maisto prekės",
            "Drabužiai",
            "Kita"
        };

        public CreateItemDtoValidator()
        {

            RuleFor(dto => dto.Name).NotEmpty().NotNull().Length(5, 100);
            RuleFor(dto => dto.Category).Must(ValidCategories.Contains);
        }
        
    }

}
