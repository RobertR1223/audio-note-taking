from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import Note
from .serializers import NoteSerializer, UserSerializer
from .permissions import IsOwner  # Import the custom permission

class NoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notes. Users can only view, update, or delete their own notes.
    """
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        """
        Return notes that belong to the currently authenticated user.
        """
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically associate the note with the logged-in user during creation.
        """
        serializer.save(user=self.request.user)

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user registration and management.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
