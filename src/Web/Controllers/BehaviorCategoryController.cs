using Application.Features.BehaviorCategories.Commands.CreateBehaviorCategory;
using Application.Features.BehaviorCategories.Commands.DeleteBehaviorCategory;
using Application.Features.BehaviorCategories.Commands.UpdateBehaviorCategory;
using Application.Features.BehaviorCategories.Queries.GetAllBehaviorCategories;
using Application.Features.BehaviorCategories.Queries.GetBehaviorCategoryById;

namespace Web.Controllers;

[ApiController]
[Route("api/behavior-category")]
public class BehaviorCategoryController(ISender sender) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAllBehaviorCategories(CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetAllBehaviorCategoriesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetBehaviorCategoryById([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetBehaviorCategoryByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    [EnableRateLimiting(RateLimitingConfiguration.GlobalPolicy)]
    public async Task<IActionResult> CreateBehaviorCategory([FromBody] CreateBehaviorCategoryCommand command, 
        CancellationToken cancellationToken)
    {
        int newBehaviorCategory = await sender.Send(command, cancellationToken);
        return Ok(newBehaviorCategory);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBehaviorCategory([FromRoute] int id, [FromBody] UpdateBehaviorCategoryCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest("ID URL not match with ID Body.");
        }

        await sender.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBehaviorCategory([FromRoute] int id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteBehaviorCategoryCommand(id), cancellationToken);
        return NoContent();
    }
}
