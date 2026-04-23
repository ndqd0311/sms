namespace Domain.Entities;

public class SeatAssignment : BaseEntity
{
    public int TeachingContextId { get; set; }

    public int StudentId { get; set; }

    public string DisplayName { get; set; }

    public int OrdinalIndex { get; set; }

    public TeachingContext? TeachingContext { get; set; }

    public Student? Student { get; set; }

    public void UpdateDisplayName(string displayName)
    {
        DisplayName = displayName;
    }
}
