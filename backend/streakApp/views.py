from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
import os
import json

from .models import Streak, Completion, User
from .serializers import StreakSerializer, CompletionSerializer, UserSerializer

# Create your views here.
class StreakViewSet(viewsets.ModelViewSet):
    queryset = Streak.objects.all().prefetch_related('completion_set')
    serializer_class = StreakSerializer
    permission_classes = [AllowAny]  # Keep AllowAny for backward compatibility

    def create(self, request, *args, **kwargs):
        print(request.data)
        return super().create(request, *args, **kwargs)

class CompletionViewSet(viewsets.ModelViewSet):
    queryset = Completion.objects.all()
    serializer_class = CompletionSerializer
    permission_classes = [AllowAny]  # Keep AllowAny for backward compatibility


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own profile
        return User.objects.filter(id=self.request.user.id)
    
    def get_serializer_context(self):
        """Add request to serializer context."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='google/initiate')
    def google_initiate(self, request):
        """Initiate Google OAuth flow."""
        # Get OAuth credentials from environment
        client_id = os.getenv('GOOGLE_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        
        if not client_id or not client_secret:
            return Response(
                {'error': 'Google OAuth credentials not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Determine redirect URI based on request
        if request.is_secure() or request.META.get('HTTP_X_FORWARDED_PROTO') == 'https':
            scheme = 'https'
        else:
            scheme = 'http'
        
        host = request.get_host()
        redirect_uri = f"{scheme}://{host}/api/users/google/callback/"
        
        # Create OAuth flow
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [redirect_uri]
                }
            },
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
        )
        flow.redirect_uri = redirect_uri
        
        # Generate authorization URL
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        # Store state in session for verification
        request.session['oauth_state'] = state
        
        return Response({
            'authorization_url': authorization_url,
            'state': state
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='google/callback')
    def google_callback(self, request):
        """Handle Google OAuth callback."""
        # Get OAuth credentials from environment
        client_id = os.getenv('GOOGLE_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        
        if not client_id or not client_secret:
            return Response(
                {'error': 'Google OAuth credentials not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Verify state
        state = request.GET.get('state')
        session_state = request.session.get('oauth_state')
        
        if not state or state != session_state:
            return Response(
                {'error': 'Invalid state parameter'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Determine redirect URI
        if request.is_secure() or request.META.get('HTTP_X_FORWARDED_PROTO') == 'https':
            scheme = 'https'
        else:
            scheme = 'http'
        
        host = request.get_host()
        redirect_uri = f"{scheme}://{host}/api/users/google/callback/"
        
        # Create OAuth flow
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [redirect_uri]
                }
            },
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
            state=state
        )
        flow.redirect_uri = redirect_uri
        
        # Exchange authorization code for tokens
        authorization_response = request.build_absolute_uri()
        try:
            flow.fetch_token(authorization_response=authorization_response)
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch token: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        credentials = flow.credentials
        
        # Get user info from Google
        from googleapiclient.discovery import build
        
        user_info_service = build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        
        google_id = user_info.get('id')
        google_email = user_info.get('email')
        google_picture = user_info.get('picture')
        name = user_info.get('name', '')
        first_name = user_info.get('given_name', '')
        last_name = user_info.get('family_name', '')
        
        # Get or create user
        user, created = User.objects.get_or_create(
            google_id=google_id,
            defaults={
                'username': google_email or f'google_{google_id}',
                'email': google_email,
                'google_email': google_email,
                'google_picture': google_picture,
                'first_name': first_name,
                'last_name': last_name,
                'google_access_token': credentials.token,
                'google_refresh_token': credentials.refresh_token,
                'google_token_expiry': credentials.expiry,
            }
        )
        
        # Update existing user if needed
        if not created:
            user.google_email = google_email
            user.google_picture = google_picture
            user.google_access_token = credentials.token
            if credentials.refresh_token:
                user.google_refresh_token = credentials.refresh_token
            user.google_token_expiry = credentials.expiry
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            user.save()
        
        # Log the user in
        from django.contrib.auth import login
        login(request, user)
        
        # Clear OAuth state from session
        if 'oauth_state' in request.session:
            del request.session['oauth_state']
        
        # Redirect to frontend callback route
        # Determine frontend URL
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost')
        return redirect(f'{frontend_url}/callback')

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current authenticated user."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout current user."""
        from django.contrib.auth import logout
        logout(request)
        return Response({'message': 'Successfully logged out'})