from django.core.management.base import BaseCommand

from tracker.models import Question

STARTER_QUESTIONS = [
    "Highest-leverage thing today",
    "Enjoyed most",
    "Best thing learned (and where it came from)",
]


class Command(BaseCommand):
    help = "Seed the recurring daily check-in questions (idempotent)."

    def handle(self, *args, **options):
        created = 0
        for i, text in enumerate(STARTER_QUESTIONS):
            _, was_created = Question.objects.get_or_create(
                text=text, defaults={"order": i, "is_active": True}
            )
            created += int(was_created)
        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded questions: {created} created, "
                f"{len(STARTER_QUESTIONS) - created} already existed."
            )
        )
