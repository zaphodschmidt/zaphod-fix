from django.db import models
from datetime import date, timedelta

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

    def recalculate_stats(self):
        """Recalculate current_streak, longest_streak, and days_completed from completions."""
        completions = self.completion_set.order_by('-date_completed')
        completed_dates = set(c.date_completed for c in completions)
        
        # Total days completed
        self.days_completed = len(completed_dates)
        
        # Calculate current streak (consecutive days from today backwards)
        current_streak = 0
        check_date = date.today()
        
        # Allow for today not being completed yet - check if yesterday was completed
        if check_date not in completed_dates:
            check_date = check_date - timedelta(days=1)
        
        while check_date in completed_dates:
            current_streak += 1
            check_date = check_date - timedelta(days=1)
        
        self.current_streak = current_streak
        
        # Calculate longest streak
        if not completed_dates:
            self.longest_streak = 0
        else:
            sorted_dates = sorted(completed_dates)
            longest = 1
            current = 1
            
            for i in range(1, len(sorted_dates)):
                if sorted_dates[i] - sorted_dates[i-1] == timedelta(days=1):
                    current += 1
                    longest = max(longest, current)
                else:
                    current = 1
            
            self.longest_streak = longest
        
        self.save(update_fields=['current_streak', 'longest_streak', 'days_completed'])


class Completion(models.Model):
    streak = models.ForeignKey(Streak, on_delete=models.CASCADE)
    date_completed = models.DateField()
    day_of_week = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.streak.name} - {self.date_completed}"

    def save(self, *args, **kwargs):
        self.day_of_week = self.date_completed.weekday()  # 0 is Monday, 6 is Sunday
        super().save(*args, **kwargs)