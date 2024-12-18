import React from "react";
import NoteItem from "./NoteItem";

const NoteList = ({ notes, onEdit, onDelete }) => {
    if (notes.length === 0) return <p>No notes available. Create one!</p>;

    return (
        <ul>
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};

export default NoteList;
