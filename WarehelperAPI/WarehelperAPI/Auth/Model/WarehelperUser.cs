using Microsoft.AspNetCore.Identity;
using WarehelperAPI.Data.Entities;

namespace WarehelperAPI.Auth.Model
{
    public class WarehelperUser : IdentityUser
    {
        public bool ForceRelogin { get; set; }
        public int? AssignedWarehouse { get; set; } //maybe list?
        public int? AssignedCompany { get; set; } //maybe list?
    }
}
