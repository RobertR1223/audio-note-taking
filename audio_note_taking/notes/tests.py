from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Note

class NotesAPITest(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username="testuser", password="password123")
        
        # Generate JWT token for the user
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        # Set Authorization header for the test client
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        # Create a note for update/delete tests
        self.note = Note.objects.create(user=self.user, title='Existing Note', description='Existing description')

    def test_create_note(self):
        url = '/api/notes/'
        data = {'title': 'Test Note', 'description': 'This is a test'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 2)  # 1 existing + 1 new note

    def test_get_notes(self):
        url = '/api/notes/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Should return 1 existing note

    def test_update_note(self):
        url = f'/api/notes/{self.note.id}/'
        updated_data = {'title': 'Updated Note', 'description': 'Updated description'}
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the note was updated
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, 'Updated Note')
        self.assertEqual(self.note.description, 'Updated description')

    def test_partial_update_note(self):
        url = f'/api/notes/{self.note.id}/'
        partial_data = {'title': 'Partially Updated Note'}
        response = self.client.patch(url, partial_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify partial update
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, 'Partially Updated Note')
        self.assertEqual(self.note.description, 'Existing description')  # Unchanged

    def test_delete_note(self):
        url = f'/api/notes/{self.note.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify the note was deleted
        self.assertEqual(Note.objects.count(), 0)
