using Application.Common.Exceptions;

namespace Application.Features.Seats.Queries.GetSeatAssignmentsByTeachingContextId;

public record GetSeatAssignmentsByTeachingContextIdQuery : IRequest<SeatAssignmentsVm>
{
    public int TeachingContextId { get; init; }
}

public class GetSeatAssignmentsByTeachingContextIdQueryHandler(
    IApplicationDbContext context,
    IMapper mapper,
    ICurrentTeacher currentTeacher)
    : IRequestHandler<GetSeatAssignmentsByTeachingContextIdQuery, SeatAssignmentsVm>
{
    public async Task<SeatAssignmentsVm> Handle(GetSeatAssignmentsByTeachingContextIdQuery request,
        CancellationToken cancellationToken)
    {
        int teacherId = await context.TeachingContexts
            .Where(tc => tc.Id == request.TeachingContextId)
            .Select(tc => tc.TeacherId)
            .FirstOrDefaultAsync(cancellationToken);

        bool isAdmin = string.Equals(currentTeacher.Role, "Admin", StringComparison.OrdinalIgnoreCase);

        if (!isAdmin && teacherId != int.Parse(currentTeacher.Id!))
        {
            throw new ForbiddenAccessException();
        }

        return new SeatAssignmentsVm
        {
            SeatAssignments = await context.SeatAssignments
                .AsNoTracking()
                .Where(sa => sa.TeachingContextId == request.TeachingContextId)
                .OrderBy(sa => sa.OrdinalIndex)
                .ProjectTo<SeatAssignmentDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
        };
    }
}
