using Domain.Events;

namespace Application.Features.Students.EventHandlers;

public class StudentAddedEventHandler(IApplicationDbContext context) : INotificationHandler<StudentAddedEvent>
{
    public async Task Handle(StudentAddedEvent notification, CancellationToken cancellationToken)
    {
        List<int> teachingContextIds = await context.TeachingContexts
            .Where(tc => tc.ClassId == notification.ClassId && tc.Id != notification.TeachingContextId)
            .Select(tc => tc.Id)
            .ToListAsync(cancellationToken);

        List<SeatAssignment> newSeatAssignments = teachingContextIds.Select(id => new SeatAssignment
        {
            TeachingContextId = id,
            Student = notification.Student,
            DisplayName = notification.DisplayName,
            OrdinalIndex = -1
        }).ToList();

        context.SeatAssignments.AddRange(newSeatAssignments);
    }
}
