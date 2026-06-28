from rest_framework import serializers

from .models import DailyAnswer, Idea, Log, Question, Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "expected_minutes",
            "actual_minutes",
            "status",
            "priority",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ["id", "body", "created_at", "updated_at"]
        read_only_fields = ["updated_at"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "text", "is_active", "order", "created_at"]
        read_only_fields = ["created_at"]


class DailyAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source="question.text", read_only=True)

    class Meta:
        model = DailyAnswer
        fields = [
            "id",
            "question",
            "question_text",
            "date",
            "answer",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class IdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Idea
        fields = ["id", "content", "source", "created_at", "updated_at"]
        read_only_fields = ["updated_at"]


class CheckinItemSerializer(serializers.Serializer):
    """One active question paired with its answer for a given date (if any)."""

    question_id = serializers.IntegerField()
    text = serializers.CharField()
    order = serializers.IntegerField()
    answer_id = serializers.IntegerField(allow_null=True)
    answer = serializers.CharField(allow_blank=True)
