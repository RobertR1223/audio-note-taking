import React, { useEffect, useState } from "react";
import { fetchNotes, deleteNote } from "../../api/api";
import NoteItem from "./NoteItem";

const NoteList = ({ onEdit }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotes = async () => {
        try {
            const response = await fetchNotes();
            setNotes(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load notes.");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNote(id);
            setNotes(notes.filter((note) => note.id !== id));
        } catch (err) {
            setError("Failed to delete note.");
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    if (loading) return <p>Loading notes...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            {notes.length === 0 ? (
                <p>No notes available. Create one!</p>
            ) : (
                <ul>
                    {notes.map((note) => (
                        <NoteItem
                            key={note.id}
                            note={note}
                            onEdit={onEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NoteList;
