using Application.Common.Interfaces;

namespace Application.Features.Classes.Commands.CreateClass;

public record CreateClassCommand : IRequest<int>
{
    public string Name { get; init; }
}

public class CreateClassCommandHandler(IApplicationDbContext context, ICurrentTeacher currentTeacher)
    : IRequestHandler<CreateClassCommand, int>
{
    public async Task<int> Handle(CreateClassCommand request, CancellationToken cancellationToken)
    {
        string? teacherId = currentTeacher.Id;

        if (teacherId == null)
        {
            throw new UnauthorizedAccessException();
        }

        int teacherIdValue = int.Parse(teacherId);

        Class entity = new()
        {
            Name = request.Name,
            CreatedBy = teacherIdValue
        };

        context.Classes.Add(entity);

        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
