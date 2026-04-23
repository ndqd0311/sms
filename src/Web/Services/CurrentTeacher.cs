using System.Security.Claims;
using Application.Common.Interfaces;

namespace Web.Services;

public class CurrentTeacher(IHttpContextAccessor httpContextAccessor) : ICurrentTeacher
{
    public string? Id => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
    public string? Role => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);
}
