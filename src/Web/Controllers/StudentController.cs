using Application.Features.Students.Commands.AddStudent;
using Application.Features.Students.Commands.DeleteStudent;
using Application.Features.Students.Commands.UpdateStudent;
using Application.Features.Students.Queries.GetStudentsByClass;

namespace Web.Controllers;

[ApiController]
[Route("api/student")]
public class StudentController(ISender sender) : ControllerBase
{
    [HttpGet("class/{classId:int}")]
    [Authorize]
    public async Task<IActionResult> GetStudentsByClass(int classId, CancellationToken cancellationToken)
    {
        StudentsVm vm = await sender.Send(new GetStudentsByClassQuery { ClassId = classId }, cancellationToken);
        return Ok(vm);
    }

    [HttpPost]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> AddStudent([FromBody] AddStudentCommand command,
        CancellationToken cancellationToken)
    {
        int newStudentId = await sender.Send(command, cancellationToken);

        return Ok(newStudentId);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> DeleteStudent(int id, CancellationToken cancellationToken)
    {
        DeleteStudentCommand command = new() { StudentId = id };

        await sender.Send(command, cancellationToken);

        return NoContent();
    }

    [HttpPut]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> UpdateStudent([FromBody] UpdateStudentCommand command,
        CancellationToken cancellationToken)
    {
        await sender.Send(command, cancellationToken);

        return NoContent();
    }
}
