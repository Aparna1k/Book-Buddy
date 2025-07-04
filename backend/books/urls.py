from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet,
    recommend_books,
    generate_summary,
    get_progress_history  # ✅ Import the new view
)
from .auth_views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'books', BookViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('recommend/', recommend_books),
    path('summarize/', generate_summary),
    
    # ✅ Custom progress tracking endpoint
    path('books/<int:book_id>/progress/', get_progress_history, name='progress-history'),
]
