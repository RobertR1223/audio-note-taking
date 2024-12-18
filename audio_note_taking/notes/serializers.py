from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Note, AudioFile

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration and management.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        validators=[validate_password],
        help_text="Password must meet the security criteria."
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        help_text="Enter the password again for confirmation."
    )

    class Meta:
        model = User
        fields = ("id", "username", "password", "confirm_password")
        extra_kwargs = {
            "username": {"required": True, "help_text": "Username must be unique."},
        }

    def validate(self, attrs):
        """
        Validate that the passwords match.
        """
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        """
        Create a new user after removing the confirm_password field.
        """
        validated_data.pop("confirm_password")
        user = User.objects.create_user(**validated_data)
        return user

class AudioFileSerializer(serializers.ModelSerializer):
    """Serializer for audio files."""
    class Meta:
        model = AudioFile
        fields = ["id", "audio", "uploaded_at"]

class NoteSerializer(serializers.ModelSerializer):
    """
    Serializer for notes with nested audio files and file uploads.
    """
    audio_files = AudioFileSerializer(many=True, read_only=True)
    uploaded_audios = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
        help_text="Upload multiple audio files.",
    )

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "description",
            "audio_files",
            "uploaded_audios",
            "user",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "created_at", "updated_at"]

    def validate_uploaded_audios(self, files):
        """
        Validate uploaded audio files.
        """
        allowed_content_types = ["audio/mpeg", "audio/wav", "audio/aac"]
        max_size = 10 * 1024 * 1024  # 10 MB

        for file in files:
            if file.size > max_size:
                raise ValidationError(f"File {file.name} exceeds the size limit of 10 MB.")

            if file.content_type not in allowed_content_types:
                raise ValidationError(f"File {file.name} has an unsupported format.")
        
        return files

    def _save_audio_files(self, note, uploaded_audios):
        """
        Save audio files linked to a note.
        """
        for audio in uploaded_audios:
            AudioFile.objects.create(note=note, audio=audio)

    def create(self, validated_data):
        """
        Handle note creation with optional audio uploads.
        """
        uploaded_audios = validated_data.pop("uploaded_audios", [])

        note = Note.objects.create(**validated_data)

        self._save_audio_files(note, uploaded_audios)

        return note

    def update(self, instance, validated_data):
        """
        Handle note updates with optional new audio uploads.
        """
        uploaded_audios = validated_data.pop("uploaded_audios", [])

        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.save()

        self._save_audio_files(instance, uploaded_audios)

        return instance