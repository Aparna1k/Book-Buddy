from rest_framework import serializers
from .models import Book
from .models import ProgressEntry

class BookSerializer(serializers.ModelSerializer):
    estimated_completion = serializers.SerializerMethodField()
    ai_review = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'  # includes isbn and all other fields
        read_only_fields = [
            'user', 'created_at', 'estimated_completion',
            'start_date', 'last_updated'
        ]

    def get_estimated_completion(self, obj):
        try:
            return obj.estimated_completion_date()
        except Exception as e:
            print("❌ Error in estimated_completion_date:", e)
            return "Unknown"

    def get_ai_review(self, obj):
        try:
            return obj.ai_review()
        except Exception as e:
            print("❌ Error generating AI review:", e)
            return "Review unavailable."
        


class ProgressEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressEntry
        fields = ['id', 'date', 'progress']