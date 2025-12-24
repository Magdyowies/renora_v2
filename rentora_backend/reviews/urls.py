from django.urls import path
from .views import ReviewCreateView, VehicleReviewsView, MyReviewsView, AdminReviewListView, ReviewDetailView

urlpatterns = [
    path('', ReviewCreateView.as_view(), name='review_create'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review_detail'),
    path('my/', MyReviewsView.as_view(), name='my_reviews'),
    path('vehicle/<int:vehicle_id>/', VehicleReviewsView.as_view(), name='vehicle_reviews'),
    path('admin/', AdminReviewListView.as_view(), name='admin_review_list'),
]
