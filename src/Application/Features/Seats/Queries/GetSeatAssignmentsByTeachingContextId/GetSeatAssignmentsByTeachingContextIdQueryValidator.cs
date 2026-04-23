namespace Application.Features.Seats.Queries.GetSeatAssignmentsByTeachingContextId;

public class GetSeatAssignmentsByTeachingContextIdQueryValidator
    : AbstractValidator<GetSeatAssignmentsByTeachingContextIdQuery>
{
    public GetSeatAssignmentsByTeachingContextIdQueryValidator()
    {
        RuleFor(x => x.TeachingContextId)
            .GreaterThan(0)
            .WithMessage("TeachingContextId must be greater than 0");
    }
}
