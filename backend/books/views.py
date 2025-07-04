from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from collections import Counter
import traceback

from .models import Book
from .serializers import BookSerializer

# ------------------ BookViewSet ------------------

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.none()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Book.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        try:
            print("📥 Incoming data:", self.request.data)
            validated = serializer.validated_data if hasattr(serializer, 'validated_data') else None
            print("✅ Validated data (pre-save):", validated)
            serializer.save(user=self.request.user)
            print("✅ Book successfully saved!")
        except Exception as e:
            print("🔥 Exception during book creation:")
            traceback.print_exc()
            raise e


# ------------------ Book Recommendations ------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommend_books(request):
    user_books = Book.objects.filter(user=request.user, status='completed')
    if not user_books.exists():
        return Response({"message": "Not enough data to recommend books."})

    genre_counts = Counter([book.genre for book in user_books])
    most_common_genre = genre_counts.most_common(1)[0][0]

    wishlist = Book.objects.filter(user=request.user, genre=most_common_genre, status='wishlist')
    recommendations = [
        {
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "source": "your wishlist"
        }
        for book in wishlist
    ]

    if not recommendations:
        recommendations = [
            {
                "title": f"Top {most_common_genre} Pick #{i+1}",
                "author": "AI Suggestion",
                "genre": most_common_genre,
                "source": "AI"
            } for i in range(3)
        ]

    return Response({
        "recommended_genre": most_common_genre,
        "recommendations": recommendations
    })

# ------------------ AI Summary Generator ------------------

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_summary(request):
    print("✅ /api/summarize/ endpoint hit")

    try:
        notes = request.data.get("notes", "").strip()
        print("📥 Notes received:", notes)

        if not notes or len(notes.split()) < 5:
            print("❌ Not enough content to summarize.")
            return Response({"summary": "Not enough content to summarize."}, status=400)

        parser = PlaintextParser.from_string(notes, Tokenizer("english"))
        summarizer = LsaSummarizer()
        summary_sentences = summarizer(parser.document, 2)
        summary_text = " ".join(str(sentence) for sentence in summary_sentences)

        print("✅ Summary created:", summary_text)

        return Response({"summary": summary_text or "Could not generate a meaningful summary."})

    except Exception as e:
        print("🔥 Exception occurred while generating summary:")
        traceback.print_exc()
        return Response({"summary": f"Error: {str(e)}"}, status=500)

from .models import ProgressEntry
from .serializers import ProgressEntrySerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress_history(request, book_id):
    entries = ProgressEntry.objects.filter(book__id=book_id, book__user=request.user).order_by('date')
    serializer = ProgressEntrySerializer(entries, many=True)
    return Response(serializer.data)

def perform_update(self, serializer):
    instance = serializer.save()
    ProgressEntry.objects.create(book=instance, progress=instance.progress)    