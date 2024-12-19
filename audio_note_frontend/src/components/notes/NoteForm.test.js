import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteForm from "./NoteForm";
import userEvent from "@testing-library/user-event";
import { createNote } from "../../api/api";

// Mocking the API call
jest.mock("../../api/api", () => ({
  createNote: jest.fn(),
}));

describe("NoteForm", () => {
    test("renders form fields and submit button", () => {
        render(<NoteForm onSubmit={jest.fn()} />);

        // Check if the title and description input fields are rendered
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        
        // Check if the submit button is rendered
        expect(screen.getByText(/save note/i)).toBeInTheDocument();
    });

    test("calls onSubmit with correct data", async () => {
        const handleSubmit = jest.fn();
        render(<NoteForm onSubmit={handleSubmit} />);

        // Simulate user input
        userEvent.type(screen.getByLabelText(/title/i), "Test Note");
        userEvent.type(screen.getByLabelText(/description/i), "Test description");

        // Simulate clicking the submit button
        userEvent.click(screen.getByText(/save note/i));

        // Wait for form submission and check if the onSubmit handler was called with the correct data
        await waitFor(() => expect(handleSubmit).toHaveBeenCalledWith({
            title: "Test Note",
            description: "Test description",
            recordings: [],
        }));
    });

    test("shows error message if required fields are empty", async () => {
        const handleSubmit = jest.fn();
        render(<NoteForm onSubmit={handleSubmit} />);

        // Submit without filling out the form
        userEvent.click(screen.getByText(/save note/i));

        // Expect an alert or error to show up
        expect(screen.getByText(/title and description are required/i)).toBeInTheDocument();
    });
});
