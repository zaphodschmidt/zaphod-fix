from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Completion

# Signals to update streak stats when completions change
@receiver(post_save, sender=Completion)
def update_streak_on_completion_save(sender, instance, **kwargs):
    """Recalculate streak stats when a completion is added or updated."""
    print(f"Updating streak stats for {instance.streak.name}")
    instance.streak.recalculate_stats()


@receiver(post_delete, sender=Completion)
def update_streak_on_completion_delete(sender, instance, **kwargs):
    """Recalculate streak stats when a completion is deleted."""
    print(f"Updating streak stats for {instance.streak.name}")
    instance.streak.recalculate_stats()
