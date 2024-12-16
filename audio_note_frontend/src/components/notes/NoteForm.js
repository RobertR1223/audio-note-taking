import React, { useState, useEffect } from "react";

const NoteForm = ({ onSubmit, existingNote, onCancel }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    useEffect(() => {
        if (existingNote) {
            setFormData({
                title: existingNote.title,
                description: existingNote.description,
            });
        }
    }, [existingNote]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            <div className="flex space-x-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {existingNote ? "Update" : "Create"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default NoteForm;
