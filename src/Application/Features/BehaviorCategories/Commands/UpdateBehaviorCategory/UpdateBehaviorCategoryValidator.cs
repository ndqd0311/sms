namespace Application.Features.BehaviorCategories.Commands.UpdateBehaviorCategory;

public class UpdateBehaviorCategoryValidator : AbstractValidator<UpdateBehaviorCategoryCommand>
    {
        public UpdateBehaviorCategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("BehaviorCategory name is required")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

            RuleFor(x => x.PointValue)
                .NotEqual(0).WithMessage("Point Value can't be 0")
                .InclusiveBetween(-100, 100).WithMessage("Point must be between -100 and 100(not = 0)");
        }
    }

