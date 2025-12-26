from django.db import models

# Create your models here.
class Streak(models.Model):
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField()
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    days_completed = models.IntegerField(default=0)
    def __str__(self):
        return self.name

class Completion(models.Model):
    streak = models.ForeignKey(Streak, on_delete=models.CASCADE)
    date_completed = models.DateField()

    def __str__(self):
        return f"{self.streak.name} - {self.date_completed}"