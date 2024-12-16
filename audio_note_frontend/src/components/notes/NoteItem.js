import React from "react";

const NoteItem = ({ note, onEdit, onDelete }) => {
    return (
        <li className="p-4 border rounded-md mb-2 shadow-sm">
            <h3 className="text-lg font-bold">{note.title}</h3>
            <p>{note.description}</p>
            <div className="flex space-x-2 mt-2">
                <button
                    onClick={() => onEdit(note)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(note.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default NoteItem;
