using Application.Features.ShareCodes.Commands.ImportTeachingContextShareCode;
using Application.Features.TeachingContexts.Commands.CreateTeachingContext;
using Application.Features.TeachingContexts.Queries.GetTeachingContextsByTeacherId;

namespace Web.Controllers;

[ApiController]
[Route("api/teaching-context")]
public class TeachingContextController(ISender sender) : ControllerBase
{
    [HttpGet]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> GetTeachingContextsByTeacherId(CancellationToken cancellationToken)
    {
        TeachingContextsVm vm = await sender.Send(new GetTeachingContextsByTeacherIdQuery(), cancellationToken);

        return Ok(vm);
    }

    [HttpPost]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> CreateTeachingContext([FromBody] CreateTeachingContextCommand command,
        CancellationToken cancellationToken)
    {
        int newTeachingContextId = await sender.Send(command, cancellationToken);

        return Ok(newTeachingContextId);
    }

    [HttpPost("share-code")]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> CreateTeachingContextByShareCode(
        [FromBody] ImportTeachingContextShareCodeCommand command,
        CancellationToken cancellationToken)
    {
        int newTeachingContextId = await sender.Send(command, cancellationToken);

        return Ok(newTeachingContextId);
    }
}
