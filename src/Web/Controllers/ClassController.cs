using Application.Features.Classes.Commands.CreateClass;
using Application.Features.Classes.Commands.DeleteClass;
using Application.Features.Classes.Commands.UpdateClass;
using Application.Features.Classes.Queries.GetClassesByTeacher;

namespace Web.Controllers;

[ApiController]
[Route("api/classes")]
[EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
public class ClassController(ISender sender) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetClasses(CancellationToken cancellationToken)
    {
        ClassesVm vm = await sender.Send(new GetClassesByTeacherQuery(), cancellationToken);
        return Ok(vm);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateClass([FromBody] CreateClassCommand command, CancellationToken cancellationToken)
    {
        int id = await sender.Send(command, cancellationToken);
        return Ok(id);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateClass([FromBody] UpdateClassCommand command, CancellationToken cancellationToken)
    {
        await sender.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteClass(int id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteClassCommand { Id = id }, cancellationToken);
        return NoContent();
    }
}
