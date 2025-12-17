from django.urls import path, include
from rest_framework.routers import DefaultRouter
from vehicles.views import AdminVehicleViewSet

router = DefaultRouter()
router.register(r'', AdminVehicleViewSet, basename='admin-vehicles')

urlpatterns = [
    path('', include(router.urls)),
]
