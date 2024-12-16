import React from "react";

const NoteList = ({ notes }) => {
    if (!notes.length) {
        return <p>No notes available. Start by creating your first note!</p>;
    }

    return (
        <ul className="note-list">
            {notes.map((note) => (
                <li key={note.id} className="note-item">
                    <h3>{note.title}</h3>
                    <p>{note.description}</p>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;
