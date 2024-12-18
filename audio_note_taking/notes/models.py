from django.db import models
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
import os

class Note(models.Model):
    """
    Model representing a note with title, description, and associated user.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class AudioFile(models.Model):
    """
    Model representing individual audio files linked to a note.
    """
    note = models.ForeignKey(Note, related_name="audio_files", on_delete=models.CASCADE)
    audio = models.FileField(upload_to="audio_notes/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audio for Note: {self.note.title} - {self.audio.name}"
    
    def delete(self, *args, **kwargs):
        """
        Override delete to ensure the file is removed from the filesystem.
        """
        if self.audio and os.path.isfile(self.audio.path):
            os.remove(self.audio.path)
        super().delete(*args, **kwargs)
