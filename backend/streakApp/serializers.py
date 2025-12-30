from rest_framework import serializers
from .models import Streak, Completion, User


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


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model with Google OAuth fields."""
    # Exclude sensitive token fields from serialization
    google_access_token = serializers.SerializerMethodField()
    google_refresh_token = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'google_id', 'google_email', 'google_picture',
            'google_access_token', 'google_refresh_token', 'google_token_expiry',
            'date_joined', 'is_active'
        ]
        read_only_fields = ['id', 'date_joined', 'is_active']
    
    def get_google_access_token(self, obj):
        # Only return token if user is viewing their own profile
        request = self.context.get('request')
        if request and request.user == obj:
            return obj.google_access_token
        return None
    
    def get_google_refresh_token(self, obj):
        # Only return token if user is viewing their own profile
        request = self.context.get('request')
        if request and request.user == obj:
            return obj.google_refresh_token
        return None