import React, { useState } from "react";
import NoteList from "../components/notes/NoteList";
import NoteForm from "../components/notes/NoteForm";
import { createNote, updateNote } from "../api/api";

const Home = () => {
    const [editingNote, setEditingNote] = useState(null);

    const handleCreateOrUpdate = async (noteData) => {
        if (editingNote) {
            await updateNote(editingNote.id, noteData);
            setEditingNote(null);
        } else {
            await createNote(noteData);
        }
        window.location.reload(); // Reload to fetch updated notes
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Manage Your Notes</h1>
            <NoteForm
                onSubmit={handleCreateOrUpdate}
                existingNote={editingNote}
                onCancel={() => setEditingNote(null)}
            />
            <NoteList onEdit={setEditingNote} />
        </div>
    );
};

export default Home;
