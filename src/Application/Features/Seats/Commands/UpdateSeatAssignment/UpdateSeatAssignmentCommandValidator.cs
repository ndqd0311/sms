namespace Application.Features.Seats.Commands.UpdateSeatAssignment;

public class UpdateSeatAssignmentCommandValidator : AbstractValidator<UpdateSeatAssignmentCommand>
{
    public UpdateSeatAssignmentCommandValidator()
    {
        RuleFor(x => x.TeachingContextId)
            .GreaterThan(0)
            .WithMessage("TeachingContextId must be greater than 0");

        RuleFor(x => x.Seats)
            .NotNull().WithMessage("Seats must not be null")
            .NotEmpty().WithMessage("Seats must not be empty");

        RuleForEach(x => x.Seats).ChildRules(seat =>
        {
            seat.RuleFor(s => s.StudentId)
                .GreaterThan(0).WithMessage("StudentId must be greater than 0");
            seat.RuleFor(s => s.OrdinalIndex)
                .Must(x => x is -1 or > 0)
                .WithMessage("OrdinalIndex must be -1 or greater than 0");
        });

        RuleFor(x => x.Seats)
            .Must(seats => seats
                .GroupBy(s => s.StudentId)
                .All(g => g.Count() == 1))
            .WithMessage("Duplicate StudentId in Seats");

        RuleFor(x => x.Seats)
            .Must(seats => seats
                .Where(s => s.OrdinalIndex > 0)
                .GroupBy(s => s.OrdinalIndex)
                .All(g => g.Count() == 1))
            .WithMessage("Duplicate OrdinalIndex in Seats");
    }
}
