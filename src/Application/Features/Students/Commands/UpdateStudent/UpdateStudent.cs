using Application.Common.Exceptions;

namespace Application.Features.Students.Commands.UpdateStudent;

public record UpdateStudentCommand : IRequest
{
    public int StudentId { get; init; }
    public int? TeachingContextId { get; init; }
    public string FullName { get; init; }
    public DateTime? BirthDay { get; init; }
    public string? DisplayName { get; init; }
}

public class UpdateStudentCommandHandler(IApplicationDbContext context) : IRequestHandler<UpdateStudentCommand>
{
    public async Task Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        Student? studentToUpdate = await context.Students
            .FirstOrDefaultAsync(s => s.Id == request.StudentId, cancellationToken);

        if (studentToUpdate == null)
        {
            throw new NotFoundException($"Student with id {request.StudentId} was not found.");
        }

        bool isStudentChanged = studentToUpdate.FullName != request.FullName || studentToUpdate.Birthday != request.BirthDay;
        if (isStudentChanged)
        {
            studentToUpdate.UpdateInfo(request.FullName, request.BirthDay);
        }

        if (request.TeachingContextId.HasValue && request.DisplayName != null)
        {
            SeatAssignment? seatAssignment = await context.SeatAssignments
                .FirstOrDefaultAsync(sa =>
                        sa.TeachingContextId == request.TeachingContextId.Value &&
                        sa.StudentId == request.StudentId,
                    cancellationToken);

            if (seatAssignment != null && seatAssignment.DisplayName != request.DisplayName)
            {
                seatAssignment.UpdateDisplayName(request.DisplayName);
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
