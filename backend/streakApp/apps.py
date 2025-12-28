from django.apps import AppConfig

class StreakAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'streakApp'
    def ready(self):
        import streakApp.signals