using Application.Features.Accounts.Commands.CreateTeacher;
using Application.Features.Accounts.Commands.DeleteTeacher;
using Application.Features.Accounts.Commands.UpdateTeacher;
using Application.Features.Accounts.Queries.GetTeachers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[ApiController]
[Route("api/teachers")]
[Authorize(Roles = "Admin")]
public class TeacherController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<TeachersVm>> GetTeachers(CancellationToken cancellationToken)
    {
        return await sender.Send(new GetTeachersQuery(), cancellationToken);
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateTeacher(CreateTeacherCommand command, CancellationToken cancellationToken)
    {
        return await sender.Send(command, cancellationToken);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateTeacher(int id, UpdateTeacherCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await sender.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteTeacher(int id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteTeacherCommand(id), cancellationToken);
        return NoContent();
    }
}
