from rest_framework.routers import DefaultRouter
from .views import UserViewSet, StreakViewSet, CompletionViewSet

router = DefaultRouter()
router.register(r'streaks', StreakViewSet)
router.register(r'completions', CompletionViewSet)
router.register(r'users', UserViewSet)

urlpatterns = router.urls