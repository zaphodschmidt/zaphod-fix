from django.contrib import admin
from .models import Streak, Completion

# Register your models here.
admin.site.register(Streak)
admin.site.register(Completion)