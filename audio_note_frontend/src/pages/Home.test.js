import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";
import { createNote, updateNote, fetchNotes, deleteNote } from "../api/api";
import React from "react";

// Mock the API calls
jest.mock("../api/api", () => ({
    fetchNotes: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
}));

describe("Home Component", () => {
    const sampleNotes = [
        { id: 1, title: "Note 1", content: "Content 1" },
        { id: 2, title: "Note 2", content: "Content 2" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("fetches and displays notes on mount", async () => {
        fetchNotes.mockResolvedValueOnce({ data: sampleNotes });

        render(<Home />);

        // Verify loading notes
        await waitFor(() => {
            expect(fetchNotes).toHaveBeenCalled();
        });

        // Check for displayed notes
        expect(screen.getByText("Note 1")).toBeInTheDocument();
        expect(screen.getByText("Content 1")).toBeInTheDocument();
        expect(screen.getByText("Note 2")).toBeInTheDocument();
    });

    it("creates a new note and updates the list", async () => {
        fetchNotes.mockResolvedValueOnce({ data: [] }); // Initially empty notes
        const newNote = { id: 3, title: "New Note", content: "New Content" };
        createNote.mockResolvedValueOnce({ data: newNote });

        render(<Home />);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "New Note" },
        });
        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: "New Content" },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/Submit/i));

        // Verify createNote is called
        await waitFor(() => {
            expect(createNote).toHaveBeenCalledWith({
                title: "New Note",
                content: "New Content",
            });
        });

        // Check that the new note appears in the list
        expect(screen.getByText("New Note")).toBeInTheDocument();
        expect(screen.getByText("New Content")).toBeInTheDocument();
    });

    it("updates an existing note", async () => {
        fetchNotes.mockResolvedValueOnce({ data: sampleNotes });
        const updatedNote = { id: 1, title: "Updated Note", content: "Updated Content" };
        updateNote.mockResolvedValueOnce({ data: updatedNote });

        render(<Home />);

        // Simulate clicking edit on the first note
        fireEvent.click(screen.getByText("Edit").closest("button"));

        // Fill out the form with updated data
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "Updated Note" },
        });
        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: "Updated Content" },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/Submit/i));

        // Verify updateNote is called
        await waitFor(() => {
            expect(updateNote).toHaveBeenCalledWith(1, {
                title: "Updated Note",
                content: "Updated Content",
            });
        });

        // Check updated note appears
        expect(screen.getByText("Updated Note")).toBeInTheDocument();
        expect(screen.getByText("Updated Content")).toBeInTheDocument();
    });

    it("deletes a note and updates the list", async () => {
        fetchNotes.mockResolvedValueOnce({ data: sampleNotes });
        deleteNote.mockResolvedValueOnce();

        render(<Home />);

        // Simulate deleting the first note
        fireEvent.click(screen.getByText("Delete").closest("button"));

        // Verify deleteNote is called
        await waitFor(() => {
            expect(deleteNote).toHaveBeenCalledWith(1);
        });

        // Check the deleted note is removed from the DOM
        expect(screen.queryByText("Note 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });
});
