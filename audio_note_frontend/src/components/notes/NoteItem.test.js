// NoteItem.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import NoteItem from "./NoteItem";

// Mock functions for edit and delete actions
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

// Sample note data
const note = {
  id: 1,
  title: "Test Note",
  description: "This is a test note with audio files.",
  audio_files: [
    { id: 1, audio: "audio_notes/test_audio1.wav" },
    { id: 2, audio: "audio_notes/test_audio2.wav" },
  ],
};

describe("NoteItem", () => {
  test("renders note title and description", () => {
    render(<NoteItem note={note} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Check that title and description are displayed
    expect(screen.getByText(note.title)).toBeInTheDocument();
    expect(screen.getByText(note.description)).toBeInTheDocument();
  });

  test("displays associated audio files", () => {
    render(<NoteItem note={note} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Check if the audio files are rendered
    const audioElements = screen.getAllByRole("audio");
    expect(audioElements).toHaveLength(2); // There should be 2 audio files
    expect(audioElements[0]).toHaveAttribute("src", note.audio_files[0].audio);
    expect(audioElements[1]).toHaveAttribute("src", note.audio_files[1].audio);
  });

  test("calls onEdit when the Edit button is clicked", () => {
    render(<NoteItem note={note} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Find the Edit button and simulate a click
    fireEvent.click(screen.getByText(/edit/i));

    // Check that the onEdit function was called with the correct note
    expect(mockOnEdit).toHaveBeenCalledWith(note);
  });

  test("calls onDelete when the Delete button is clicked", () => {
    render(<NoteItem note={note} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Find the Delete button and simulate a click
    fireEvent.click(screen.getByText(/delete/i));

    // Check that the onDelete function was called with the correct note id
    expect(mockOnDelete).toHaveBeenCalledWith(note.id);
  });
});
