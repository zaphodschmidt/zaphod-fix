import rest_framework as drf
from .models import Streak, Completion

class CompletionSerializer(drf.serializers.ModelSerializer):
    class Meta:
        model = Completion
        fields = '__all__'

class StreakSerializer(drf.serializers.ModelSerializer):
    completions = CompletionSerializer(many=True, read_only=True, source='completion_set')

    class Meta:
        model = Streak
        fields = '__all__'