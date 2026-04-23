namespace Application.Features.TeachingContexts.Commands.CreateTeachingContext;

public record CreateTeachingContextCommand : IRequest<int>
{
    public int ClassId { get; init; }
    public string ClassName { get; init; }
    public string TeachingContextName { get; init; }
    public int NumCols { get; init; }
    public int NumRows { get; init; }
    public int SeatsPerTable { get; init; }
}

public class CreateTeachingContextCommandHandler(IApplicationDbContext context, ICurrentTeacher currentTeacher)
    : IRequestHandler<CreateTeachingContextCommand, int>
{
    public async Task<int> Handle(CreateTeachingContextCommand request, CancellationToken cancellationToken)
    {
        string? teacherId = currentTeacher.Id;

        if (teacherId == null)
        {
            throw new UnauthorizedAccessException();
        }

        int teacherIdValue = int.Parse(teacherId);

        TeachingContext newTeachingContext = new()
        {
            TeacherId = teacherIdValue,
            ClassId = request.ClassId,
            ContextName = request.TeachingContextName,
            NumCols = request.NumCols,
            NumRows = request.NumRows,
            SeatsPerTable = request.SeatsPerTable
        };

        context.TeachingContexts.Add(newTeachingContext);

        await context.SaveChangesAsync(cancellationToken);

        return newTeachingContext.Id;
    }
}
