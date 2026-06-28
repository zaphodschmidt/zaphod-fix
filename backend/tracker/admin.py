from django.contrib import admin

from .models import DailyAnswer, Idea, Log, Question, Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "status",
        "expected_minutes",
        "actual_minutes",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = ("title", "description")


@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ("__str__", "created_at", "updated_at")
    search_fields = ("body",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "is_active", "order")
    list_editable = ("is_active", "order")


@admin.register(DailyAnswer)
class DailyAnswerAdmin(admin.ModelAdmin):
    list_display = ("date", "question", "updated_at")
    list_filter = ("date", "question")
    search_fields = ("answer",)


@admin.register(Idea)
class IdeaAdmin(admin.ModelAdmin):
    list_display = ("__str__", "source", "created_at")
    search_fields = ("content", "source")
