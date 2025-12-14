from django.urls import path
from .views import ReviewCreateView, VehicleReviewsView, MyReviewsView

urlpatterns = [
    path('', ReviewCreateView.as_view(), name='review_create'),
    path('my/', MyReviewsView.as_view(), name='my_reviews'),
    path('vehicle/<int:vehicle_id>/', VehicleReviewsView.as_view(), name='vehicle_reviews'),
]
