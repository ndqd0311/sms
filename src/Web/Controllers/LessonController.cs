using Application.Features.Lessons.Commands;
using Application.Features.Lessons.Queries.GetLessonsByContext;

namespace Web.Controllers;

[ApiController]
[Route("api/lessons")]
public class LessonController(ISender sender) : ControllerBase
{
    [HttpGet("by-context/{teachingContextId:int}")]
    [Authorize]
    public async Task<IActionResult> GetLessonsByContext([FromRoute] int teachingContextId, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetLessonsByContextQuery(teachingContextId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("start")]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> StartLesson([FromBody] StartLessonCommand command,
        CancellationToken cancellationToken)
    {
        int lessonId = await sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(StartLesson), new { id = lessonId }, lessonId);
    }

    [HttpPut("{id:int}/end")]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> EndLesson([FromRoute] int id, CancellationToken cancellationToken)
    {
        EndLessonCommand command = new(id);
        await sender.Send(command, cancellationToken);
        return NoContent();
    }
}
