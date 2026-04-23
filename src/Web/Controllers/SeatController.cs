using Application.Features.Seats.Commands.UpdateSeatAssignment;
using Application.Features.Seats.Queries.GetSeatAssignmentsByTeachingContextId;

namespace Web.Controllers;

[ApiController]
[Route("api/seat")]
public class SeatController(ISender sender) : ControllerBase
{
    [HttpGet("{teachingContextId:int}")]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> GetSeatAssignmentByTeachingContextId(int teachingContextId,
        CancellationToken cancellationToken)
    {
        SeatAssignmentsVm vm = await sender.Send(
            new GetSeatAssignmentsByTeachingContextIdQuery { TeachingContextId = teachingContextId },
            cancellationToken);

        return Ok(vm);
    }

    [HttpPut]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> UpdateSeatAssignment([FromBody] UpdateSeatAssignmentCommand command,
        CancellationToken cancellationToken)
    {
        await sender.Send(command, cancellationToken);

        return NoContent();
    }
}
