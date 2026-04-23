namespace Application.Features.BehaviorCategories.Commands.CreateBehaviorCategory;

public record CreateBehaviorCategoryCommand(int TeacherId, string Name, int PointValue) : IRequest<int>;

public class CreateBehaviorCategoryHandler(IApplicationDbContext context, ICurrentTeacher currentTeacher)
    : IRequestHandler<CreateBehaviorCategoryCommand, int>
{
    public async Task<int> Handle(CreateBehaviorCategoryCommand request, CancellationToken cancellationToken)
    {
        string? currentTeacherId = currentTeacher.Id;
        if (currentTeacherId == null)
        {
            throw new UnauthorizedAccessException();
        }

        BehaviorCategory behaviorCategory = new()
        {
            TeacherId = int.Parse(currentTeacherId), Name = request.Name, PointValue = request.PointValue
        };
        context.BehaviorCategories.Add(behaviorCategory);
        await context.SaveChangesAsync(cancellationToken);
        return behaviorCategory.Id;
    }
}
