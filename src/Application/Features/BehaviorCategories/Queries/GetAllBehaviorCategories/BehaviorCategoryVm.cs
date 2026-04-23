namespace Application.Features.BehaviorCategories.Queries.GetAllBehaviorCategories;

public class BehaviorCategoryVm
{
    public IReadOnlyCollection<BehaviorCategoryDto> BehaviorCategories { get; init; } = [];
}
