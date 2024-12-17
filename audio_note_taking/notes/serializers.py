from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Note Serializer
class NoteSerializer(serializers.ModelSerializer):
    audio = serializers.FileField(required=False)  # Optional field for audio upload

    class Meta:
        model = Note
        fields = ["id", "title", "description", "audio", "user", "created_at", "updated_at"]
        read_only_fields = ["user"]