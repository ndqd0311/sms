namespace Application.Features.BehaviorCategories.Queries.GetAllBehaviorCategories;

using AutoMapper.QueryableExtensions;

public record GetAllBehaviorCategoriesQuery : IRequest<BehaviorCategoryVm>;

public class GetAllBehaviorCategoriesHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetAllBehaviorCategoriesQuery, BehaviorCategoryVm>
{
    public async Task<BehaviorCategoryVm> Handle(GetAllBehaviorCategoriesQuery request, CancellationToken cancellationToken)
    {
        var items = await context.BehaviorCategories
            .AsNoTracking()
            .Where(x => x.DeletedAt == null)
            .OrderBy(x => x.Name)
            .ProjectTo<BehaviorCategoryDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new BehaviorCategoryVm { BehaviorCategories = items };
    }
}
