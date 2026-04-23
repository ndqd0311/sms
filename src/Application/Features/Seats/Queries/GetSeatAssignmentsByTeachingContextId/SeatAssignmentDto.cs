namespace Application.Features.Seats.Queries.GetSeatAssignmentsByTeachingContextId;

public class SeatAssignmentDto
{
    public int Id { get; init; }

    public int StudentId { get; init; }

    public string DisplayName { get; init; }

    public int OrdinalIndex { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<SeatAssignment, SeatAssignmentDto>();
        }
    }
}
