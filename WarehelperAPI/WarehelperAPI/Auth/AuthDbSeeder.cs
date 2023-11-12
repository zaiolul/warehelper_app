using Microsoft.AspNetCore.Identity;
using WarehelperAPI.Auth.Model;

namespace WarehelperAPI.Auth
{
    public class AuthDbSeeder
    {
        private readonly UserManager<WarehelperUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager; 
        public AuthDbSeeder(UserManager<WarehelperUser> userManager, RoleManager<IdentityRole> roleManager) {
            _userManager = userManager;
            _roleManager = roleManager;
            
        }

        public async Task SeedAsync()
        {
            await AddDefaultRoles();
            await AddAdminUser("admin1");
            await AddAdminUser("admin2");
        }
        public async Task AddDefaultRoles()
        {
            foreach(var role in WarehelperRoles.All)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if(!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        private async Task AddAdminUser(string name)
        {
            var newAdminUser = new WarehelperUser
            {
                UserName = name,
                Email = "admin@mail.com"
            };

            var existingAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
            if(existingAdminUser == null)
            {
                var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, "Admin123!");
                if(createAdminUserResult.Succeeded)
                {
                    await _userManager.AddToRolesAsync(newAdminUser, WarehelperRoles.All);
                }
            }
           
        }
    }
}
