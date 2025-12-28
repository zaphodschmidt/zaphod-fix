from rest_framework import viewsets
from .models import Streak, Completion
from .serializers import StreakSerializer, CompletionSerializer

# Create your views here.
class StreakViewSet(viewsets.ModelViewSet):
    queryset = Streak.objects.all().prefetch_related('completion_set')
    serializer_class = StreakSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        return super().create(request, *args, **kwargs)

class CompletionViewSet(viewsets.ModelViewSet):
    queryset = Completion.objects.all()
    serializer_class = CompletionSerializer