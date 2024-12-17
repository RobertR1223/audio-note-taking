from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note, AudioFile

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# AudioFile Serializer
class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ["id", "audio", "uploaded_at"]  # Expose audio file URL and upload timestamp


# Note Serializer
class NoteSerializer(serializers.ModelSerializer):
    audio_files = AudioFileSerializer(many=True, read_only=True)  # Nested audio files
    uploaded_audios = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )  # Handles file uploads

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "description",
            "audio_files",  # Read-only nested audio files
            "uploaded_audios",  # Write-only for file uploads
            "user",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "created_at", "updated_at"]

    def create(self, validated_data):
        # Pop uploaded_audios from the validated data
        uploaded_audios = validated_data.pop("uploaded_audios", [])

        # Create the note instance
        note = Note.objects.create(**validated_data)

        # Save audio files linked to the note
        for audio in uploaded_audios:
            AudioFile.objects.create(note=note, audio=audio)

        return note

    def update(self, instance, validated_data):
        # Handle optional uploaded_audios field during update
        uploaded_audios = validated_data.pop("uploaded_audios", [])

        # Update other fields
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.save()

        # Save new audio files
        for audio in uploaded_audios:
            AudioFile.objects.create(note=instance, audio=audio)

        return instance
