from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to allow only the owner of a note to view or edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Return True if the user owns the object
        return obj.user == request.user
