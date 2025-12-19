from django.urls import path
from .views import (
    VehicleListView, VehicleDetailView, VehicleCreateView,
    VehicleCategoryListView, VendorVehiclesView,
    VehicleImageUploadView, VehicleImageDeleteView, AdminVehicleListView
)

urlpatterns = [
    path('', VehicleListView.as_view(), name='vehicle_list'),
    path('list/', AdminVehicleListView.as_view(), name='admin_vehicle_list'),
    path('create/', VehicleCreateView.as_view(), name='vehicle_create'),
    path('<int:pk>/', VehicleDetailView.as_view(), name='vehicle_detail'),
    path('<int:pk>/images/', VehicleImageUploadView.as_view(), name='vehicle_image_upload'),
    path('<int:pk>/images/<int:image_pk>/', VehicleImageDeleteView.as_view(), name='vehicle_image_delete'),
    path('categories/', VehicleCategoryListView.as_view(), name='category_list'),
    path('my/', VendorVehiclesView.as_view(), name='vendor_vehicles'),
]
