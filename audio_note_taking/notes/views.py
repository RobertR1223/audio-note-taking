from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import Note, AudioFile
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
        Automatically associate the note with the logged-in user during creation
        and handle multiple audio file uploads.
        """
        note = serializer.save(user=self.request.user)  # Save the note
        uploaded_audios = self.request.FILES.getlist("uploaded_audios")  # Fetch multiple audio files
        
        for audio in uploaded_audios:
            AudioFile.objects.create(note=note, audio=audio)  # Save each audio file

    def perform_update(self, serializer):
        """
        Handle updating a note and optionally uploading new audio files.
        """
        note = serializer.save()  # Save updated note details
        uploaded_audios = self.request.FILES.getlist("uploaded_audios")  # Fetch new audio files

        # Save new audio files linked to the note
        for audio in uploaded_audios:
            AudioFile.objects.create(note=note, audio=audio)


# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user registration and management.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
