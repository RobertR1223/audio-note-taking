from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import Note, AudioFile
from .serializers import NoteSerializer, UserSerializer
from .permissions import IsOwner
from django.db import transaction
import os

class NoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notes with audio file uploads.
    Users can only view, update, or delete their own notes.
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

    def perform_update(self, serializer):
        """
        Handle updating a note and optionally uploading or deleting audio files.
        """
        with transaction.atomic():  # Ensure atomicity of the operation
            instance = serializer.save()  # Save other fields of the note

            # Remove all existing audio files linked to the note
            existing_audio_files = AudioFile.objects.filter(note=instance)
            for audio_file in existing_audio_files:
                if audio_file.audio and os.path.isfile(audio_file.audio.path):
                    os.remove(audio_file.audio.path)  # Delete the file from the filesystem
                audio_file.delete()  # Remove the database entry

            # Handle newly uploaded audio files
            uploaded_audios = self.request.FILES.getlist("uploaded_audios")
            for audio in uploaded_audios:
                AudioFile.objects.create(note=instance, audio=audio)
    
    def destroy(self, request, *args, **kwargs):
        """
        Override destroy to delete associated audio files from media storage.
        """
        instance = self.get_object()

        # Delete all associated audio files from storage
        audio_files = AudioFile.objects.filter(note=instance)
        for audio in audio_files:
            if audio.audio and os.path.isfile(audio.audio.path):
                os.remove(audio.audio.path)
            audio.delete()

        return super().destroy(request, *args, **kwargs)

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user registration and management.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
