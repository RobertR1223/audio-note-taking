from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Note

class NotesAPITest(APITestCase):

    def setUp(self):
        # Create two test users
        self.user1 = User.objects.create_user(username="testuser1", password="password123")
        self.user2 = User.objects.create_user(username="testuser2", password="password456")

        # Generate JWT tokens
        refresh1 = RefreshToken.for_user(self.user1)
        self.token1 = str(refresh1.access_token)

        refresh2 = RefreshToken.for_user(self.user2)
        self.token2 = str(refresh2.access_token)

        # Set Authorization header for user1
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')

        # Create a note for user1
        self.note_user1 = Note.objects.create(
            user=self.user1, title='User1 Note', description='This belongs to User1'
        )

    def test_create_note(self):
        """Test that a user can create a new note."""
        url = '/api/notes/'
        data = {'title': 'New Note', 'description': 'This is a test note'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 2)  # 1 existing + 1 new note
        self.assertEqual(Note.objects.last().user, self.user1)

    def test_get_notes(self):
        """Test that a user can only retrieve their own notes."""
        # User1 fetches their notes
        url = '/api/notes/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'User1 Note')

    def test_cannot_access_other_users_notes(self):
        """Test that a user cannot access notes belonging to another user."""
        # User2 tries to access User1's notes
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token2}')
        url = f'/api/notes/{self.note_user1.id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_note(self):
        """Test that a user can update their own note."""
        url = f'/api/notes/{self.note_user1.id}/'
        updated_data = {'title': 'Updated Note', 'description': 'Updated description'}
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the note was updated
        self.note_user1.refresh_from_db()
        self.assertEqual(self.note_user1.title, 'Updated Note')
        self.assertEqual(self.note_user1.description, 'Updated description')

    def test_cannot_update_other_users_notes(self):
        """Test that a user cannot update another user's note."""
        # User2 tries to update User1's note
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token2}')
        url = f'/api/notes/{self.note_user1.id}/'
        updated_data = {'title': 'Hacked Note'}
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verify the note was not updated
        self.note_user1.refresh_from_db()
        self.assertNotEqual(self.note_user1.title, 'Hacked Note')

    def test_delete_note(self):
        """Test that a user can delete their own note."""
        url = f'/api/notes/{self.note_user1.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify the note was deleted
        self.assertEqual(Note.objects.count(), 0)

    def test_cannot_delete_other_users_notes(self):
        """Test that a user cannot delete another user's note."""
        # User2 tries to delete User1's note
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token2}')
        url = f'/api/notes/{self.note_user1.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Verify the note still exists
        self.assertEqual(Note.objects.count(), 1)

    def test_unauthorized_access(self):
        """Test that unauthenticated users cannot access the notes endpoint."""
        # Remove credentials
        self.client.credentials()
        url = '/api/notes/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
