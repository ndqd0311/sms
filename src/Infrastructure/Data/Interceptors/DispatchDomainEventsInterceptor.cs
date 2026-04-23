using Domain.Common;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure.Data.Interceptors;

public class DispatchDomainEventsInterceptor(IMediator mediator) : SaveChangesInterceptor
{
    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        await DispatchEvents(eventData.Context, EventTiming.PreSave);

        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        DispatchEvents(eventData.Context, EventTiming.PreSave).GetAwaiter().GetResult();

        return base.SavingChanges(eventData, result);
    }

    public override async ValueTask<int> SavedChangesAsync(SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken cancellationToken = default)
    {
        await DispatchEvents(eventData.Context, EventTiming.PostSave);

        return await base.SavedChangesAsync(eventData, result, cancellationToken);
    }

    public override int SavedChanges(SaveChangesCompletedEventData eventData,
        int result)
    {
        DispatchEvents(eventData.Context, EventTiming.PostSave).GetAwaiter().GetResult();

        return base.SavedChanges(eventData, result);
    }

    private async Task DispatchEvents(DbContext? context, EventTiming timing)
    {
        if (context == null)
        {
            return;
        }

        List<EntityEntry<BaseEntity>> entities = context.ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.Entity.DomainEvents.Any(de => de.Timing == timing))
            .ToList();

        if (entities.Count == 0)
        {
            return;
        }

        foreach (EntityEntry<BaseEntity> entityEntry in entities)
        {
            BaseEntity entity = entityEntry.Entity;

            List<BaseEvent> eventsToDispatch = entity.DomainEvents
                .Where(e => e.Timing == timing)
                .ToList();

            foreach (BaseEvent domainEvent in eventsToDispatch)
            {
                entity.RemoveDomainEvent(domainEvent);

                await mediator.Publish(domainEvent);
            }
        }
    }
}
