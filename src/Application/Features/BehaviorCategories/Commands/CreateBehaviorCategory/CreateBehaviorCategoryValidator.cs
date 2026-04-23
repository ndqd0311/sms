namespace Application.Features.BehaviorCategories.Commands.CreateBehaviorCategory;

public class CreateBehaviorCategoryValidator : AbstractValidator<CreateBehaviorCategoryCommand>
{
    public  CreateBehaviorCategoryValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
        RuleFor(x=>x.PointValue).NotEmpty().WithMessage("Please specify a point value");
    }
}
