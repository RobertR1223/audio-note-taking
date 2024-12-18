from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Note, AudioFile

class UserSerializerTest(APITestCase):
    def setUp(self):
        """
        Set up initial test data.
        """
        self.valid_user_data = {
            "username": "testuser",
            "password": "SecurePassword123",
            "confirm_password": "SecurePassword123",
        }
        self.mismatched_password_data = {
            "username": "testuser",
            "password": "SecurePassword123",
            "confirm_password": "DifferentPassword456",
        }
        self.weak_password_data = {
            "username": "testuser",
            "password": "123",
            "confirm_password": "123",
        }

    def test_create_user_success(self):
        """
        Test creating a user with valid data.
        """
        url = "/api/users/"
        response = self.client.post(url, self.valid_user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.first()
        self.assertEqual(user.username, "testuser")

    def test_mismatched_passwords(self):
        """
        Test that mismatched passwords result in an error.
        """
        url = "/api/users/"
        response = self.client.post(url, self.mismatched_password_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        self.assertEqual(response.data["password"][0], "Passwords do not match.")
        self.assertEqual(User.objects.count(), 0)

    def test_weak_password(self):
        """
        Test that weak passwords result in an error.
        """
        url = "/api/users/"
        response = self.client.post(url, self.weak_password_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        self.assertTrue(any("This password" in error for error in response.data["password"]))
        self.assertEqual(User.objects.count(), 0)

    def test_duplicate_username(self):
        """
        Test that duplicate usernames are not allowed.
        """
        User.objects.create_user(username="testuser", password="SecurePassword123")
        url = "/api/users/"
        response = self.client.post(url, self.valid_user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)
        self.assertEqual(response.data["username"][0], "A user with that username already exists.")
        self.assertEqual(User.objects.count(), 1)

    def test_user_can_login(self):
        """
        Test that a user can log in with the correct credentials.
        """
        # Create user
        user = User.objects.create_user(username="testuser", password="SecurePassword123")
        refresh = RefreshToken.for_user(user)
        url = "/api/token/"
        data = {"username": "testuser", "password": "SecurePassword123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_with_invalid_credentials(self):
        """
        Test that login fails with invalid credentials.
        """
        # Create user
        User.objects.create_user(username="testuser", password="SecurePassword123")
        url = "/api/token/"
        data = {"username": "testuser", "password": "WrongPassword"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)
        self.assertEqual(str(response.data["detail"]), "No active account found with the given credentials")

class NotesAudioAPITest(APITestCase):
    def setUp(self):
        # Create test users
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
        

    def create_audio_file(self, name="test_audio.wav", content=b"audio data"):
        """
        Helper function to create a mock audio file for testing.
        """
        return SimpleUploadedFile(name, content, content_type="audio/wav")

    def test_create_note_with_audio(self):
        """
        Test creating a note with multiple audio files.
        """
        url = '/api/notes/'
        audio1 = self.create_audio_file(name="audio1.wav")
        audio2 = self.create_audio_file(name="audio2.wav")

        data = {
            'title': 'New Note with Audio',
            'description': 'This is a note with multiple audio files.',
            'uploaded_audios': [audio1, audio2],
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify the note and audio files are created
        note = Note.objects.get(title="New Note with Audio")
        self.assertEqual(note.audio_files.count(), 2)

    def test_update_note_with_audio(self):
        """
        Test updating a note by removing old audio files and adding new ones.
        """
        # Create initial audio files for the note
        
        AudioFile.objects.create(note=self.note_user1, audio=self.create_audio_file("audio1.wav"))
        AudioFile.objects.create(note=self.note_user1, audio=self.create_audio_file("audio2.wav"))

        # Prepare new audio files for update
        new_audio1 = self.create_audio_file("new_audio1.wav")
        new_audio2 = self.create_audio_file("new_audio2.wav")

        # Update the note with new audio files
        url = f"/api/notes/{self.note_user1.id}/"
        data = {
            "title": "Updated Note",
            "description": "Updated description",
            "uploaded_audios": [new_audio1, new_audio2]
        }

        response = self.client.put(url, data, format="multipart")

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.note_user1.refresh_from_db()
        self.assertEqual(self.note_user1.title, "Updated Note")
        self.assertEqual(self.note_user1.description, "Updated description")
        self.assertEqual(self.note_user1.audio_files.count(), 2)
        self.assertTrue(self.note_user1.audio_files.filter(audio="audio_notes/new_audio1.wav").exists())
        self.assertTrue(self.note_user1.audio_files.filter(audio="audio_notes/new_audio2.wav").exists())

    def test_delete_note_with_audio(self):
        """
        Test deleting a note also deletes associated audio files.
        """
        # Add audio files to the note
        audio1 = AudioFile.objects.create(note=self.note_user1, audio=self.create_audio_file(name="audio1.wav"))
        audio2 = AudioFile.objects.create(note=self.note_user1, audio=self.create_audio_file(name="audio2.wav"))

        # Verify audio files exist
        self.assertTrue(audio1.audio.storage.exists(audio1.audio.name))
        self.assertTrue(audio2.audio.storage.exists(audio2.audio.name))

        # Delete the note
        url = f'/api/notes/{self.note_user1.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify the audio files are deleted
        self.assertFalse(audio1.audio.storage.exists(audio1.audio.name))
        self.assertFalse(audio2.audio.storage.exists(audio2.audio.name))

    def test_cannot_access_other_users_note(self):
        """
        Test that a user cannot access, update, or delete another user's notes.
        """
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token2}')
        url = f'/api/notes/{self.note_user1.id}/'

        # Attempt to access the note
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Attempt to update the note
        data = {'title': 'Unauthorized Update'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Attempt to delete the note
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access(self):
        """
        Test that unauthenticated users cannot access the notes endpoint.
        """
        self.client.credentials()
        url = '/api/notes/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
