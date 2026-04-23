namespace Domain.Entities;

public class ContextBehaviorMap : BaseEntity
{
    public int TeachingContextId { get; set; }

    public int BehaviorCategoryId { get; set; }

    public TeachingContext? TeachingContext { get; set; }

    public BehaviorCategory? BehaviorCategory { get; set; }
}
