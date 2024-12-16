import React, { useEffect, useState } from "react";
import { fetchNotes } from "../api/api"; // API to fetch notes
import NoteList from "../components/notes/NoteList"; // List Component
import { getAccessToken } from "../utils/token"; // Helper for token management
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [notes, setNotes] = useState([]); // State to hold notes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state
    const navigate = useNavigate();

    // Fetch notes from API
    useEffect(() => {
        const loadNotes = async () => {
            const token = getAccessToken();
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetchNotes();
                setNotes(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load notes. Please try again.");
                setLoading(false);
            }
        };

        loadNotes();
    }, [navigate]);

    return (
        <div className="home-container">
            <h1>Welcome to Your Notes</h1>
            {loading && <p>Loading notes...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && <NoteList notes={notes} />}
        </div>
    );
};

export default Home;
