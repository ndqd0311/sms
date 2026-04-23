using MediatR;

namespace Domain.Common;

public abstract class BaseEvent : INotification
{
    public virtual EventTiming Timing => EventTiming.PreSave;
}
