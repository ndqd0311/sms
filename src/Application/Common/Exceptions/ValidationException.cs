namespace Application.Common.Exceptions;

public class ValidationException : Exception
{
    public ValidationException(List<ValidationFailure> failures)
        : base("One or more validation failures have occurred.")
    {
        Errors = failures;
    }

    public List<ValidationFailure> Errors { get; }
}
