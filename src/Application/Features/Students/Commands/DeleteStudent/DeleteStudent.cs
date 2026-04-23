using Application.Common.Exceptions;

namespace Application.Features.Students.Commands.DeleteStudent;

public record DeleteStudentCommand : IRequest
{
    public int StudentId { get; init; }
}

public class DeleteStudentCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteStudentCommand>
{
    public async Task Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
    {
        Student? studentToDelete = await context.Students
            .FirstOrDefaultAsync(s => s.Id == request.StudentId, cancellationToken);

        if (studentToDelete == null)
        {
            throw new NotFoundException($"Student with id {request.StudentId} was not found.");
        }

        studentToDelete.MarkAsDeleted();

        List<SeatAssignment> seatAssignments = await context.SeatAssignments
            .Where(x => x.StudentId == request.StudentId)
            .ToListAsync(cancellationToken);

        if (seatAssignments.Count > 0)
        {
            context.SeatAssignments.RemoveRange(seatAssignments);
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
