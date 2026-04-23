namespace Application.Features.BehaviorCategories.Queries.GetBehaviorCategoryById;

using Application.Common.Exceptions;

public record GetBehaviorCategoryByIdQuery(int Id) : IRequest<BehaviorCategoryDto>;

public class GetBehaviorCategoryByIdHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetBehaviorCategoryByIdQuery, BehaviorCategoryDto>
{
    public async Task<BehaviorCategoryDto> Handle(GetBehaviorCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var behaviorCategory = await context.BehaviorCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.DeletedAt == null, cancellationToken);

        if (behaviorCategory is null)
        {
            throw new NotFoundException(nameof(BehaviorCategory), request.Id);
        }

        return mapper.Map<BehaviorCategoryDto>(behaviorCategory);
    }
}
