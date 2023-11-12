using Microsoft.AspNetCore.Identity;

namespace WarehelperAPI.Auth.Model
{
    public class WarehelperUser : IdentityUser
    {
        public bool ForceRelogin { get; set; }
    }
}
