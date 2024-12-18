import React from "react";

const NoteItem = ({ note, onEdit, onDelete }) => {
    return (
        <li className="p-4 border rounded-md mb-2 shadow-sm">
            <h3 className="text-lg font-bold">{note.title}</h3>
            <p>{note.description}</p>

            {/* Display associated audio files */}
            {note.audio_files && note.audio_files.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold">Audio Files:</h4>
                    <ul className="mt-2">
                        {note.audio_files.map((audio) => (
                            <li key={audio.id} className="flex items-center space-x-2 mb-2">
                                <audio controls className="w-full">
                                    <source src={audio.audio} type="audio/wav" />
                                    Your browser does not support the audio element.
                                </audio>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex space-x-2 mt-4">
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
