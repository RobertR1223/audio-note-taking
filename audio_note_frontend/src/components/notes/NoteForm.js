import React, { useState, useRef } from "react";
import { createNote } from "../../api/api";

const NoteForm = () => {
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [recordings, setRecordings] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordTime, setRecordTime] = useState("00:00:00.0");
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(0);
    const elapsedTimeRef = useRef(0); // Tracks total elapsed time

    // Handle form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Format recording time
    const formatTime = (duration) => {
        const milliseconds = Math.floor((duration % 1000) / 100);
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        const hours = Math.floor(duration / (1000 * 60 * 60));
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${milliseconds}`;
    };

    // Start the timer
    const startTimer = () => {
        startTimeRef.current = Date.now() - elapsedTimeRef.current; // Resume from the paused time
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            setRecordTime(formatTime(elapsed));
        }, 100);
    };

    // Stop the timer
    const stopTimer = () => {
        clearInterval(timerRef.current);
        elapsedTimeRef.current = Date.now() - startTimeRef.current; // Save total elapsed time
    };

    // Start Recording
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        let chunks = [];
        mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" });
            setRecordings((prev) => [...prev, { blob, id: Date.now() }]);
            stopTimer();
            setIsRecording(false);
            setIsPaused(false);
            elapsedTimeRef.current = 0; // Reset elapsed time
        };

        mediaRecorder.start();
        setIsRecording(true);
        setIsPaused(false);
        startTimer();
    };

    // Pause/Resume Recording
    const togglePauseRecording = () => {
        if (isPaused) {
            mediaRecorderRef.current.resume();
            startTimer();
            setIsPaused(false);
        } else {
            mediaRecorderRef.current.pause();
            stopTimer();
            setIsPaused(true);
        }
    };

    // Stop Recording
    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
    };

    // Delete Recording
    const deleteRecording = (id) => {
        setRecordings((prev) => prev.filter((rec) => rec.id !== id));
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate input fields
        if (!formData.title || !formData.description) {
            alert("Title and description are required.");
            return;
        }
    
        // Create FormData object
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
    
        // Append each audio file under the 'uploaded_audios' field
        recordings.forEach((recording, index) => {
            const fileName = `audio_${index + 1}.wav`; // Sequential naming for clarity
            formDataToSend.append("uploaded_audios", recording.blob, fileName);
        });
    
        try {
            // Send the formData to the API
            const response = await createNote(formDataToSend);
            console.log("Note created successfully!", response.data);
    
            // Provide feedback and reset form
            alert("Note created successfully!");
            setFormData({ title: "", description: "" }); // Clear input fields
            setRecordings([]); // Reset recordings list
        } catch (error) {
            console.error("Error creating note:", error.response?.data || error.message);
            alert("Failed to create note. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
            <div>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>
            <div>
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>
            <div className="mt-4">
                {/* Start/Stop/Pause/Resume Buttons */}
                {!isRecording && (
                    <button
                        type="button"
                        onClick={startRecording}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Start Recording
                    </button>
                )}
                {isRecording && (
                    <>
                        <button
                            type="button"
                            onClick={togglePauseRecording}
                            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                        >
                            {isPaused ? "Resume Recording" : "Pause Recording"}
                        </button>
                        <button
                            type="button"
                            onClick={stopRecording}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Stop Recording
                        </button>
                    </>
                )}
                {isRecording && (
                    <div className="mt-2 text-gray-700 font-semibold">
                        Recording Time: {recordTime}
                    </div>
                )}
            </div>

            {/* Display Recorded Files */}
            {recordings.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold">Recorded Files</h3>
                    {recordings.map((recording) => (
                        <div
                            key={recording.id}
                            className="flex items-center justify-between mt-2 border p-2 rounded"
                        >
                            <audio controls>
                                <source src={URL.createObjectURL(recording.blob)} type="audio/wav" />
                            </audio>
                            <button
                                type="button"
                                onClick={() => deleteRecording(recording.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                Save Note
            </button>
        </form>
    );
};

export default NoteForm;
