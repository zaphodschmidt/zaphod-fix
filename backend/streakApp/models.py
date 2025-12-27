from django.db import models

# Create your models here.
class Streak(models.Model):
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField()
    color = models.CharField(max_length=255, unique=True)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    days_completed = models.IntegerField(default=0)
    def __str__(self):
        return self.name

class Completion(models.Model):
    streak = models.ForeignKey(Streak, on_delete=models.CASCADE)
    date_completed = models.DateField()
    day_of_week = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.streak.name} - {self.date_completed}"

    def save(self, *args, **kwargs):
        self.day_of_week = self.date_completed.weekday() # 0 is Monday, 6 is Sunday
        super().save(*args, **kwargs)