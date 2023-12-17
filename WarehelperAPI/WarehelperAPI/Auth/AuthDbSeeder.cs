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
            for(int i = 0; i <2; i++)
            {
                await AddAdminUser(string.Format("admin{0}", i));
            }
            for (int i = 0; i < 4; i++)
            {
                await AddWorkerUser(string.Format("worker{0}", i));
            }
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
        private async Task AddWorkerUser(string name)
        {
            var newWorkerUser = new WarehelperUser
            {
                UserName = name,
                Email = "worker@mail.com"
            };

            var existingWorkerUser = await _userManager.FindByNameAsync(newWorkerUser.UserName);
            if (existingWorkerUser == null)
            {
                var createWorkerUserResult = await _userManager.CreateAsync(newWorkerUser, "Worker123!");
                if (createWorkerUserResult.Succeeded)
                {
                        await _userManager.AddToRoleAsync(newWorkerUser, WarehelperRoles.Worker);

                    }
                }

        }
    }
}
