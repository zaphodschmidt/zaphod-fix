from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CheckinView,
    DailyAnswerViewSet,
    IdeaViewSet,
    LogViewSet,
    QuestionViewSet,
    TaskViewSet,
)

router = DefaultRouter()
router.register(r"tasks", TaskViewSet)
router.register(r"logs", LogViewSet)
router.register(r"ideas", IdeaViewSet)
router.register(r"questions", QuestionViewSet)
router.register(r"daily-answers", DailyAnswerViewSet)

urlpatterns = [
    path("checkin/", CheckinView.as_view(), name="checkin"),
    path("", include(router.urls)),
]
