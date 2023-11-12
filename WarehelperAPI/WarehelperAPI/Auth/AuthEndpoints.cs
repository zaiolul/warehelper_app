using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using MySqlX.XDevAPI.Common;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using WarehelperAPI.Auth.Model;

namespace WarehelperAPI.Auth
{
    public static class AuthEndpoints
    {
        public static void AddAuthApi(this WebApplication app)
        {
            app.MapPost("api/register", async (UserManager<WarehelperUser> userManager, RegisterUserDto registerUserDto) =>
            {
                var user = await userManager.FindByNameAsync(registerUserDto.Username);
                if (user != null)
                {
                    return Results.UnprocessableEntity("User already exists");
                }
                var newUser = new WarehelperUser
                {
                    Email = registerUserDto.Email,
                    UserName = registerUserDto.Username
                };
                var createUserResult = await userManager.CreateAsync(newUser, registerUserDto.Password);
                if (!createUserResult.Succeeded)
                {
                    return Results.UnprocessableEntity("Enter stronger login info :)");

                }

                await userManager.AddToRoleAsync(newUser, WarehelperRoles.Worker);
                return Results.Created("api/login", new UserDto(newUser.Id, newUser.UserName, newUser.Email));
            });

            app.MapPost("api/login", async (UserManager<WarehelperUser> userManager,JwtTokenService tokenService, LoginUserDto loginDto) =>
            {
                System.Diagnostics.Trace.TraceError("LOGIN");
                var user = await userManager.FindByNameAsync(loginDto.UserName);
                if (user == null)
                {
                    return Results.UnprocessableEntity("Username or password was incorrect");
                }

                var valid = await userManager.CheckPasswordAsync(user, loginDto.Password);
                if (!valid)
                {
                    return Results.UnprocessableEntity("Username or password was incorrect");

                }

                user.ForceRelogin = false;
                await userManager.UpdateAsync(user);

                var roles = await userManager.GetRolesAsync(user);
                var accessToken = tokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var refreshToken = tokenService.CreateRefreshToken(user.Id);
                Console.WriteLine($"USER NAME: {user.UserName} USER ID {user.Id}");
                System.Diagnostics.Trace.WriteLine($"USER NAME: {user.UserName} USER ID {user.Id}");
                return Results.Ok(new SuccessfulLoginDto(accessToken, refreshToken));
            });


            app.MapPost("api/accessToken", async (UserManager<WarehelperUser> userManager, JwtTokenService tokenService, RefreshAccessTokenDto refreshDto) =>
            {
                if (!tokenService.TryParseRefreshToken(refreshDto.RefreshToken, out var claims))
                {
                    return Results.UnprocessableEntity();
                }

                var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
                var user = await userManager.FindByIdAsync(userId);

                if(user == null)
                {
                    return Results.UnprocessableEntity("Invalid token");
                }

                if (user.ForceRelogin)
                {
                    return Results.UnprocessableEntity();
                }


                var roles = await userManager.GetRolesAsync(user);
                var accessToken = tokenService.CreateAccessToken(user.UserName, user.Id, roles);
                var refreshToken = tokenService.CreateRefreshToken(user.Id);

                return Results.Ok(new SuccessfulLoginDto(accessToken, refreshToken));
            });
        }
    }
}

public record UserDto(string UserId, string UserName, string Email);

public record RegisterUserDto(string Username,string Email, string Password);

public record LoginUserDto(string UserName, string Password);
public record SuccessfulLoginDto(string AccessToken, string RefreshToken);
public record RefreshAccessTokenDto(string RefreshToken);
