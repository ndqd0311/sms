namespace Application.Features.BehaviorCategories.Queries.GetAllBehaviorCategories;

public record BehaviorCategoryDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public int PointValue { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<BehaviorCategory, BehaviorCategoryDto>();
        }
    }
}
