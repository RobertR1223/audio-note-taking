import React, { useState, useEffect } from "react";
import NoteList from "../components/notes/NoteList";
import NoteForm from "../components/notes/NoteForm";
import { createNote, updateNote, fetchNotes, deleteNote } from "../api/api";

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);

    // Load notes from the API
    const loadNotes = async () => {
        try {
            const response = await fetchNotes();
            setNotes(response.data); // Update the notes state
        } catch (err) {
            console.error("Failed to fetch notes:", err);
        }
    };

    // Fetch notes on component mount
    useEffect(() => {
        loadNotes();
    }, []);

    // Handle note creation or update
    const handleCreateOrUpdate = async (noteData) => {
        try {
            if (editingNote) {
                // Update existing note
                const updatedNote = await updateNote(editingNote.id, noteData);
                setNotes((prevNotes) =>
                    prevNotes.map((note) =>
                        note.id === editingNote.id ? updatedNote.data : note
                    )
                );
                setEditingNote(null);
            } else {
                // Create a new note
                const newNote = await createNote(noteData);
                setNotes((prevNotes) => [newNote.data, ...prevNotes]);
            }
        } catch (err) {
            console.error("Failed to create or update note:", err);
        }
    };

    // Handle note deletion
    const handleDelete = async (id) => {
        try {
            await deleteNote(id);
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        } catch (err) {
            console.error("Failed to delete note:", err);
        }
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Manage Your Notes</h1>
            <NoteForm
                onSubmit={handleCreateOrUpdate}
                existingNote={editingNote}
                onCancel={() => setEditingNote(null)}
            />
            <NoteList
                notes={notes}
                onEdit={setEditingNote}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Home;
