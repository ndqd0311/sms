using Application.Common.Exceptions;
using ValidationException = FluentValidation.ValidationException;

namespace Application.Features.BehaviorCategories.Commands.UpdateBehaviorCategory;

public record UpdateBehaviorCategoryCommand(int Id, string Name, int PointValue) : IRequest<bool>;

public class UpdateBehaviorCategoryHandler(
    IApplicationDbContext context, 
    ICurrentTeacher currentTeacher) 
    : IRequestHandler<UpdateBehaviorCategoryCommand, bool>
{
    public async Task<bool> Handle(UpdateBehaviorCategoryCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(currentTeacher.Id))
        {
            throw new UnauthorizedAccessException();
        }
        int teacherId = int.Parse(currentTeacher.Id);

        var behaviorCategory = await context.BehaviorCategories
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (behaviorCategory is null)
        {
            throw new NotFoundException(nameof(BehaviorCategory), request.Id);
        }
        
        bool nameExists = await context.BehaviorCategories
            .AnyAsync(x => x.Name.ToLower() == request.Name.ToLower() 
                           && x.Id != request.Id, 
                cancellationToken);

        if (nameExists)
        {
            throw new ValidationException([
                new ValidationFailure(nameof(request.Name), "This name already exists.")
            ]);
        }
        behaviorCategory.Name = request.Name;
        behaviorCategory.PointValue = request.PointValue;
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
