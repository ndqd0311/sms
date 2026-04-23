namespace Application.Features.Seats.Commands.UpdateSeatAssignment;

public record SeatUpdateItem
{
    public int StudentId { get; init; }
    public int OrdinalIndex { get; init; }
    public string? DisplayName { get; init; }
}
