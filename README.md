# Audio Note-Taking App - Backend

This is the backend service for the **Audio Note-Taking App**, which allows users to create, update, and manage notes with associated audio files. Built using Django, Django REST Framework, and PostgreSQL.

## Prerequisites

Before starting, ensure you have the following installed:
- Python 3.9 or higher
- PostgreSQL
- pip (Python package manager)
- Virtual environment tools (e.g., venv, virtualenv)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_folder>
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/MacOS
   venv\Scripts\activate     # Windows
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
4. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```env
   SECRET_KEY=your_secret_key
   DEBUG=True
   DATABASE_NAME=audio_note_app
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_postgres_password
   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5432
5. Set up the PostgreSQL database:
   - Create the database:
     ```sql
     CREATE DATABASE audio_note_app;
     ```
   - Ensure the database credentials in the `.env` file match the database configuration.
6. Run database migrations:
   ```bash
   python manage.py migrate
7. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
8. Start the development server:
   ```bash
   python manage.py runserver

## API Endpoints

Here is a summary of the key endpoints provided by this backend:

### Authentication
- `POST /api/token/` - Obtain JWT access and refresh tokens
- `POST /api/token/refresh/` - Refresh access token

### Notes
- `GET /api/notes/` - Retrieve all notes for the authenticated user
- `POST /api/notes/` - Create a new note (with optional audio files)
- `GET /api/notes/<id>/` - Retrieve a specific note
- `PUT /api/notes/<id>/` - Update a specific note (removes old audio files and adds new ones)
- `DELETE /api/notes/<id>/` - Delete a specific note along with associated audio files

### Users
- `POST /api/users/` - Register a new user
- `GET /api/users/` - View all users (admin only)

---

## Key Features

- **JWT Authentication**: Secure user authentication using access and refresh tokens.
- **Audio File Management**: Supports uploading, retrieving, and managing multiple audio files linked to a note.
- **User-Specific Notes**: Each user can only view, create, update, and delete their own notes.
- **Database**: Data is persisted in a PostgreSQL database.

---

## Testing

To run tests for the backend:
```bash
python manage.py test

