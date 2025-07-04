from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

STATUS_CHOICES = (
    ('reading', 'Reading'),
    ('completed', 'Completed'),
    ('wishlist', 'Wishlist'),
)

# ✅ Named function for default start_date
def today():
    return timezone.now().date()

class Book(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    isbn = models.CharField(max_length=20, blank=True, null=True)  # ✅ ISBN field
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    progress = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    start_date = models.DateField(default=today)
    last_updated = models.DateField(auto_now=True)

    def estimated_completion_date(self):
        try:
            if self.status == 'completed' or self.progress >= 100:
                return "Completed"

            if self.progress < 10:
                return "Insufficient data"

            days_since_start = (self.last_updated - self.start_date).days
            if days_since_start <= 0:
                return "Insufficient time passed"

            avg_daily_progress = self.progress / days_since_start
            if avg_daily_progress == 0:
                return "No progress trend detected"

            remaining_percent = 100 - self.progress
            estimated_days = int(remaining_percent / avg_daily_progress)
            projected_date = self.last_updated + timedelta(days=estimated_days)

            return projected_date.strftime('%Y-%m-%d')

        except Exception as e:
            print("❌ Error calculating estimated_completion_date:", e)
            return "Unknown"

    def ai_review(self):
        if not self.notes or not self.rating:
            return "Not enough data to generate a review."

        review = f"This book received a {self.rating}/5 rating. Based on the notes, it seems "
        notes_lower = self.notes.lower()

        if "inspiring" in notes_lower:
            review += "truly inspiring and impactful."
        elif "slow" in notes_lower:
            review += "a bit slow-paced but still meaningful."
        elif "complex" in notes_lower:
            review += "complex and intellectually challenging."
        elif "boring" in notes_lower:
            review += "less engaging and perhaps not very enjoyable."
        else:
            review += "enjoyable and worth reading."

        return review

    def __str__(self):
        return self.title


class ProgressEntry(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='progress_entries')
    date = models.DateField(auto_now_add=True)
    progress = models.IntegerField()

    def __str__(self):
        return f"{self.book.title} - {self.progress}% on {self.date}"
