namespace Application.Features.Students.Commands.AddStudent;

public record AddStudentCommand : IRequest<int>
{
    public int ClassId { get; init; }
    public string FullName { get; init; }
    public DateTime? BirthDay { get; init; }
    public int TeachingContextId { get; init; }
    public string DisplayName { get; init; }
    public int OrdinalIndex { get; init; }
}

public class AddStudentCommandHandler(IApplicationDbContext context)
    : IRequestHandler<AddStudentCommand, int>
{
    public async Task<int> Handle(AddStudentCommand request, CancellationToken cancellationToken)
    {
        Student newStudent = new()
        {
            ClassId = request.ClassId, FullName = request.FullName, Birthday = request.BirthDay
        };

        SeatAssignment newSeatAssignment = new()
        {
            TeachingContextId = request.TeachingContextId,
            Student = newStudent,
            DisplayName = request.DisplayName,
            OrdinalIndex = request.OrdinalIndex
        };

        context.Students.Add(newStudent);

        context.SeatAssignments.Add(newSeatAssignment);

        newStudent.MarkAsAdded(request.TeachingContextId, request.DisplayName);

        await context.SaveChangesAsync(cancellationToken);

        return newStudent.Id;
    }
}
