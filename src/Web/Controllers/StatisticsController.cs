using Application.Features.Statistics.Queries;

namespace Web.Controllers;

[ApiController]
[Route("api/statistics")]
public class StatisticsController(ISender sender) : ControllerBase
{
    [HttpGet("student/{studentId:int}/points")]
    [Authorize]
    public async Task<IActionResult> GetStudentPointStatistics([FromRoute] int studentId, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetStudentPointStatisticsQuery(studentId), cancellationToken);
        return Ok(result);
    }
}
