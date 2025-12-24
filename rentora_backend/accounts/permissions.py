from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to users with the 'admin' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsAdminOrVendorRole(permissions.BasePermission):
    """
    Allows access only to users with 'admin' or 'vendor' roles.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'vendor']
