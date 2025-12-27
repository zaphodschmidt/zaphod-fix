from django.db import models

class Color(models.TextChoices):
    RED = 'red'
    ORANGE = 'orange'
    AMBER = 'amber'
    YELLOW = 'yellow'
    LIME = 'lime'
    GREEN = 'green'
    EMERALD = 'emerald'
    TEAL = 'teal'   
    CYAN = 'cyan'
    SKY = 'sky'
    BLUE = 'blue'
    INDIGO = 'indigo'
    VIOLET = 'violet'
    PURPLE = 'purple'
    FUCHSIA = 'fuchsia'
    PINK = 'pink'
    ROSE = 'rose'
    SLATE = 'slate'
    GRAY = 'gray'
    ZINC = 'zinc'
    NEUTRAL = 'neutral'
    STONE = 'stone'

class Streak(models.Model):
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField()
    color = models.CharField(max_length=255, unique=True, choices=Color.choices)
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