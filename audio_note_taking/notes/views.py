from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Note
from .serializers import NoteSerializer, UserSerializer
from django.contrib.auth.models import User

# User Registration
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# Notes Viewset
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
