from rest_framework.routers import DefaultRouter
from .views import StreakViewSet, CompletionViewSet

router = DefaultRouter()
router.register(r'streaks', StreakViewSet)
router.register(r'completions', CompletionViewSet)

urlpatterns = router.urls