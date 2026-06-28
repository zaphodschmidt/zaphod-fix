from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    """Abstract base that records creation and last-edit timestamps.

    `created_at` defaults to now but is settable so entries can be backfilled
    onto a past day from the day navigator.
    """

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Task(TimeStampedModel):
    """Something you're doing or plan to do, with an expected time and completion tracking.

    Merges "what I'm doing right now" with "a todo with the time I expect to spend".
    """

    class Status(models.TextChoices):
        TODO = "todo", "To do"
        IN_PROGRESS = "in_progress", "In progress"
        DONE = "done", "Done"

    class Priority(models.TextChoices):
        """Eisenhower matrix quadrants."""

        URGENT_IMPORTANT = "urgent_important", "Urgent & Important"
        URGENT_NOT_IMPORTANT = "urgent_not_important", "Urgent, Not Important"
        NOT_URGENT_IMPORTANT = "not_urgent_important", "Not Urgent, Important"
        NOT_URGENT_NOT_IMPORTANT = (
            "not_urgent_not_important",
            "Not Urgent, Not Important",
        )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, help_text="Markdown supported.")
    expected_minutes = models.PositiveIntegerField(
        null=True, blank=True, help_text="Time you expect to spend on this."
    )
    actual_minutes = models.PositiveIntegerField(
        null=True, blank=True, help_text="Time you actually spent."
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.TODO
    )
    priority = models.CharField(
        max_length=32,
        choices=Priority.choices,
        default=Priority.URGENT_IMPORTANT,
        help_text="Eisenhower matrix quadrant.",
    )
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Log(TimeStampedModel):
    """A freeform, timestamped journal entry. Markdown supported, fully editable."""

    body = models.TextField(help_text="Markdown supported.")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (self.body[:50] + "…") if len(self.body) > 50 else self.body


class Question(models.Model):
    """A recurring daily reflection prompt, e.g. 'What did you enjoy most today?'."""

    text = models.CharField(max_length=500)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.text


class DailyAnswer(TimeStampedModel):
    """An answer to a daily question for a specific date (one answer per question per day)."""

    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    date = models.DateField()
    answer = models.TextField(blank=True, help_text="Markdown supported.")

    class Meta:
        ordering = ["-date", "question__order"]
        constraints = [
            models.UniqueConstraint(
                fields=["question", "date"],
                name="unique_answer_per_question_per_day",
            )
        ]

    def __str__(self):
        return f"{self.date} · {self.question.text[:40]}"


class Idea(TimeStampedModel):
    """A captured idea, with the required source/context of where it came from."""

    content = models.TextField(help_text="The idea.")
    source = models.CharField(
        max_length=500,
        help_text="Where you heard it / what you were doing when the idea came.",
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (self.content[:50] + "…") if len(self.content) > 50 else self.content
