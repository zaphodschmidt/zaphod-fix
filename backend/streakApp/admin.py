from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Streak, Completion, User

# Register your models here.
admin.site.register(Streak)
admin.site.register(Completion)
admin.site.register(User, UserAdmin)
