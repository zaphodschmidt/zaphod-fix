from rest_framework import serializers
from .models import Streak, Completion


class CompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Completion
        fields = '__all__'


class StreakSerializer(serializers.ModelSerializer):
    completions = CompletionSerializer(many=True, read_only=True, source='completion_set')
    # These are computed by signals and should be read-only
    current_streak = serializers.IntegerField(read_only=True)
    longest_streak = serializers.IntegerField(read_only=True)
    days_completed = serializers.IntegerField(read_only=True)

    class Meta:
        model = Streak
        fields = '__all__'