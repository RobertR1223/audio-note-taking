import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "./AuthForm";

describe("AuthForm Component", () => {
    const onSubmitMock = jest.fn();
    const setup = (props) => render(<AuthForm {...props} />);

    it("renders the form with title, inputs, and button", () => {
        setup({
            title: "Login",
            onSubmit: onSubmitMock,
            error: null,
            buttonLabel: "Submit",
        });

        // Check form title
        expect(screen.getByText("Login")).toBeInTheDocument();

        // Check input fields
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

        // Check submit button
        expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    });

    it("handles user input for username and password", () => {
        setup({
            title: "Login",
            onSubmit: onSubmitMock,
            error: null,
            buttonLabel: "Submit",
        });

        // Find inputs
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        // Simulate user typing
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });

        // Check if input values are updated
        expect(usernameInput.value).toBe("testuser");
        expect(passwordInput.value).toBe("testpassword");
    });

    it("calls onSubmit with form data when submitted", () => {
        setup({
            title: "Login",
            onSubmit: onSubmitMock,
            error: null,
            buttonLabel: "Submit",
        });

        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole("button", { name: /Submit/i });

        // Simulate user input
        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });

        // Submit the form
        fireEvent.click(submitButton);

        // Check if onSubmit was called with correct data
        expect(onSubmitMock).toHaveBeenCalledWith({
            username: "testuser",
            password: "testpassword",
        });
    });

    it("displays an error message when error prop is provided", () => {
        const errorMessage = "Invalid credentials";

        setup({
            title: "Login",
            onSubmit: onSubmitMock,
            error: errorMessage,
            buttonLabel: "Submit",
        });

        // Check if error message is displayed
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toHaveClass("text-red-500");
    });
});
