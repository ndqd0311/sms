using Application.Features.ShareCodes.Commands.CreateTeachingContextShareCode;
using Application.Features.ShareCodes.Commands.ImportTeachingContextShareCode;
using Microsoft.EntityFrameworkCore;
using Application.Common.Interfaces;

namespace Web.Controllers;

[ApiController]
[Route("api/share-code")]
public class ShareCodeController(ISender sender, IApplicationDbContext context) : ControllerBase
{
    [HttpPost]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> CreateTeachingContextShareCode(
        [FromBody] CreateTeachingContextShareCodeCommand command,
        CancellationToken cancellationToken)
    {
        string code = await sender.Send(command, cancellationToken);

        return Ok(code);
    }

    [HttpPost("import")]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> ImportShareCode(
        [FromBody] ImportTeachingContextShareCodeCommand command,
        CancellationToken cancellationToken)
    {
        int newContextId = await sender.Send(command, cancellationToken);
        return Ok(new { teachingContextId = newContextId });
    }

    [HttpGet("resolve/{code}")]
    [Authorize]
    public async Task<IActionResult> ResolveShareCode([FromRoute] string code, CancellationToken cancellationToken)
    {
        var shareCode = await context.ShareCodes
            .Where(sc => sc.Code == code)
            .Select(sc => new { sc.SourceContextId, sc.ExpiredAt })
            .FirstOrDefaultAsync(cancellationToken);

        if (shareCode == null)
            return NotFound(new { message = "Mã chia sẻ không tồn tại." });

        if (shareCode.ExpiredAt != null && shareCode.ExpiredAt < DateTimeOffset.UtcNow)
            return BadRequest(new { message = "Mã chia sẻ đã hết hạn." });

        return Ok(new { teachingContextId = shareCode.SourceContextId });
    }
}
