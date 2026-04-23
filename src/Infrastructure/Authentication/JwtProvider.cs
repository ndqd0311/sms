using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Common.Interfaces.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Authentication;

public class JwtProvider(IOptions<JwtSettings> jwtOptions) : IJwtProvider
{
    private readonly JwtSettings _jwtSettings = jwtOptions.Value;

    public string Generate(Teacher teacher)
    {
        string roleName = teacher.Role?.Name ?? (teacher.RoleId == 2 ? "Admin" : "Teacher");

        Claim[] claims =
        [
            new(JwtRegisteredClaimNames.Sub, teacher.Id.ToString()),
            new(ClaimTypes.NameIdentifier, teacher.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, teacher.Email),
            new("FullName", teacher.FullName),
            new(ClaimTypes.Role, roleName)
        ];

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            _jwtSettings.Issuer,
            _jwtSettings.Audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
