using Application.Features.BehaviorLogs.Commands.LogBehavior;
using Application.Features.BehaviorLogs.Queries.GetClassBehaviorHistory;
using Application.Features.BehaviorLogs.Queries.GetStudentBehaviorHistory;
using Application.Features.BehaviorLogs.Queries.GetStudentBehaviorHistoryInContext;

namespace Web.Controllers;

[ApiController]
[Route("api/behavior-logs")]
public class BehaviorLogController(ISender sender) : ControllerBase
{
    //xem học sinh
    [HttpGet("student/{studentId:int}/lesson/{lessonId:int}")]
    [Authorize]
    public async Task<IActionResult> GetStudentHistory(
        [FromRoute] int studentId,
        [FromRoute] int lessonId,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetStudentBehaviorHistoryQuery(lessonId, studentId), cancellationToken);
        return Ok(result);
    }

    //xem học sinh trong cả bối cảnh (nhiều tiết)
    [HttpGet("student/{studentId:int}/context/{contextId:int}")]
    [Authorize]
    public async Task<IActionResult> GetStudentHistoryInContext(
        [FromRoute] int studentId,
        [FromRoute] int contextId,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetStudentBehaviorHistoryInContextQuery(contextId, studentId), cancellationToken);
        return Ok(result);
    }

    //xem cả lớp
    [HttpGet("class/lesson/{lessonId:int}")]
    [Authorize]
    public async Task<IActionResult> GetClassHistory(
        [FromRoute] int lessonId,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetClassBehaviorHistory(lessonId), cancellationToken);
        return Ok(result);
    }
    
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> LogStudentBehavior(
        [FromBody] LogBehaviorCommand command,
        CancellationToken cancellationToken)
    {
        var logId = await sender.Send(command, cancellationToken);
        return CreatedAtAction(
            nameof(GetStudentHistory),
            new { studentId = command.StudentId, lessonId = command.LessonId },
            new { Id = logId, Message = "Log successful" });
    }
}
