import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
import { register } from "../api/api";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Mock the API and useNavigate function
jest.mock("../api/api", () => ({
    register: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("Register Component", () => {
    const renderRegister = () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the registration form with correct title and button", () => {
        renderRegister();

        // Check for form title
        expect(screen.getByText("Sign Up")).toBeInTheDocument();

        // Check for button
        expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
    });

    it("shows success message and redirects on successful registration", async () => {
        // Mock successful registration API call
        register.mockResolvedValueOnce();

        renderRegister();

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/Username/i), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "password123" },
        });

        // Simulate form submission
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

        // Verify API call
        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                username: "testuser",
                password: "password123",
            });
        });

        // Simulate success feedback (using setTimeout in the component)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("shows an error message on failed registration", async () => {
        // Mock failed registration
        register.mockRejectedValueOnce(new Error("Registration failed"));

        renderRegister();

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/Username/i), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "password123" },
        });

        // Simulate form submission
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

        // Verify API call
        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                username: "testuser",
                password: "password123",
            });
        });

        // Check for error message
        expect(
            screen.getByText(/Registration failed. Please try again./i)
        ).toBeInTheDocument();
    });
});
