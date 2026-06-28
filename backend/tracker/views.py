from datetime import date as date_cls

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework import filters, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DailyAnswer, Idea, Log, Question, Task
from .serializers import (
    CheckinItemSerializer,
    DailyAnswerSerializer,
    IdeaSerializer,
    LogSerializer,
    QuestionSerializer,
    TaskSerializer,
)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["status"]
    ordering_fields = ["created_at", "updated_at", "completed_at", "expected_minutes"]


class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ["created_at", "updated_at"]


class IdeaViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ["created_at", "updated_at"]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["is_active"]
    ordering_fields = ["order", "created_at"]


class DailyAnswerViewSet(viewsets.ModelViewSet):
    queryset = DailyAnswer.objects.select_related("question").all()
    serializer_class = DailyAnswerSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["date", "question"]
    ordering_fields = ["date", "created_at"]


class CheckinView(APIView):
    """Active questions paired with their answer for a given date.

    GET /api/checkin/?date=YYYY-MM-DD (defaults to today in server local time).
    Convenience endpoint for the daily check-in screen and the future MCP server.
    """

    @extend_schema(
        operation_id="checkin_retrieve",
        parameters=[
            OpenApiParameter(
                name="date",
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                required=False,
                description="Date to fetch the check-in for (YYYY-MM-DD). Defaults to today.",
            )
        ],
        responses=CheckinItemSerializer(many=True),
    )
    def get(self, request):
        date_str = request.query_params.get("date")
        target = timezone.localdate()
        if date_str:
            try:
                target = date_cls.fromisoformat(date_str)
            except ValueError:
                pass

        questions = list(Question.objects.filter(is_active=True))
        answers = {
            a.question_id: a
            for a in DailyAnswer.objects.filter(
                date=target, question__in=questions
            )
        }
        items = [
            {
                "question_id": q.id,
                "text": q.text,
                "order": q.order,
                "answer_id": answers[q.id].id if q.id in answers else None,
                "answer": answers[q.id].answer if q.id in answers else "",
            }
            for q in questions
        ]
        return Response(CheckinItemSerializer(items, many=True).data)
