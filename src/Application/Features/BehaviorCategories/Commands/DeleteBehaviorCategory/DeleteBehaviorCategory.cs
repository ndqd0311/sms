using Application.Common.Exceptions;

namespace Application.Features.BehaviorCategories.Commands.DeleteBehaviorCategory;

public record DeleteBehaviorCategoryCommand(int Id) : IRequest<int>;

public class DeleteBehaviorCategory(IApplicationDbContext context) 
    : IRequestHandler<DeleteBehaviorCategoryCommand, int>
{
    public async Task<int> Handle(DeleteBehaviorCategoryCommand request, CancellationToken cancellationToken)
    {
        var behaviorCategory = await context.BehaviorCategories
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (behaviorCategory is null)
        {
            throw new NotFoundException(nameof(BehaviorCategory), request.Id);
        }
        
        behaviorCategory.DeletedAt = DateTimeOffset.UtcNow;
        await context.SaveChangesAsync(cancellationToken);
        return behaviorCategory.Id;
    }
}
