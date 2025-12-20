from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from accounts.views import UserListView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/users/', include('accounts.user_urls')),
    path('api/users/list/', UserListView.as_view(), name='user-list-for-admin'),
    path('api/vehicles/', include('vehicles.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/', include('core.urls')),
    path('api/admin/users/', include('accounts.admin_urls')),
    path('api/admin/vehicles/', include('vehicles.admin_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
