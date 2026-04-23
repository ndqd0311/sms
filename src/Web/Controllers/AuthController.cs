using Application.Features.Authentication.Commands.ChangePassword;
using Application.Features.Authentication.Commands.Login;
using Application.Features.Authentication.Commands.Register;

namespace Web.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(ISender sender) : ControllerBase
{
    [HttpPost("login")]
    [EnableRateLimiting(RateLimitingConfiguration.AuthPolicy)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command, CancellationToken cancellationToken)
    {
        string token = await sender.Send(command, cancellationToken);
        return Ok(new { Token = token });
    }

    [HttpPost("register")]
    [EnableRateLimiting(RateLimitingConfiguration.AuthPolicy)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command, CancellationToken cancellationToken)
    {
        string token = await sender.Send(command, cancellationToken);
        return Created(string.Empty, new { Token = token });
    }

    [HttpPut("password")]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.AuthPolicy)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePswCommand command, CancellationToken cancellationToken)
    {
        await sender.Send(command, cancellationToken);
        return NoContent();
    }
}
