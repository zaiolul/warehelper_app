using Microsoft.AspNetCore.Identity;

namespace WarehelperAPI.Auth.Model
{
    public class WarehelperUser : IdentityUser
    {
        public bool ForceRelogin { get; set; }
        public int? AssignedWarehouse { get; set; } //maybe list?
    }
}
