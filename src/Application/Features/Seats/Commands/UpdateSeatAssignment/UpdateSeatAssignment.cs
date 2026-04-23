using Application.Common.Exceptions;

namespace Application.Features.Seats.Commands.UpdateSeatAssignment;

public record UpdateSeatAssignmentCommand : IRequest
{
    public int TeachingContextId { get; init; }
    public List<SeatUpdateItem> Seats { get; init; } = new();
}

public class UpdateSeatAssignmentCommandHandler(IApplicationDbContext context, ICurrentTeacher currentTeacher)
    : IRequestHandler<UpdateSeatAssignmentCommand>
{
    public async Task Handle(UpdateSeatAssignmentCommand request, CancellationToken cancellationToken)
    {
        int? teacherId = await context.TeachingContexts
            .Where(tc => tc.Id == request.TeachingContextId)
            .Select(tc => (int?)tc.TeacherId)
            .FirstOrDefaultAsync(cancellationToken);

        if (teacherId == null)
        {
            throw new NotFoundException("TeachingContext not found");
        }

        int currentTeacherId = int.Parse(currentTeacher.Id!);

        if (teacherId != currentTeacherId)
        {
            throw new ForbiddenAccessException();
        }

        List<int> studentIds = request.Seats.Select(s => s.StudentId).ToList();

        List<SeatAssignment> seatAssignments = await context.SeatAssignments
            .Where(sa => sa.TeachingContextId == request.TeachingContextId && studentIds.Contains(sa.StudentId))
            .ToListAsync(cancellationToken);

        Dictionary<int, SeatUpdateItem> seatDict = request.Seats.ToDictionary(
            x => x.StudentId,
            x => x
        );

        foreach (SeatAssignment seat in seatAssignments)
        {
            seat.OrdinalIndex = -1;
        }

        await context.SaveChangesAsync(cancellationToken);

        foreach (SeatAssignment seat in seatAssignments)
        {
            var item = seatDict[seat.StudentId];
            seat.OrdinalIndex = item.OrdinalIndex;
            if (item.DisplayName != null)
                seat.DisplayName = item.DisplayName;
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
