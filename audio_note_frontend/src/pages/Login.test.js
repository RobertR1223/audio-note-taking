import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { login } from "../api/api";
import { MemoryRouter } from "react-router-dom";

// Mocking the API and navigate function
jest.mock("../api/api", () => ({
    login: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
    const renderLogin = () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("renders the login form", () => {
        renderLogin();

        // Check if AuthForm renders with title and button
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    });

    it("successfully logs in and navigates to home", async () => {
        // Mock successful login response
        login.mockResolvedValueOnce({
            data: {
                access: "mocked-access-token",
                refresh: "mocked-refresh-token",
            },
        });

        renderLogin();

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/Username/i), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "password123" },
        });

        // Simulate form submission
        fireEvent.click(screen.getByRole("button", { name: /Login/i }));

        // Wait for the API call and subsequent actions
        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                username: "testuser",
                password: "password123",
            });
        });

        // Verify tokens are stored in localStorage
        expect(localStorage.getItem("access_token")).toBe("mocked-access-token");
        expect(localStorage.getItem("refresh_token")).toBe("mocked-refresh-token");

        // Verify navigation to "/"
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("shows an error message on failed login", async () => {
        // Mock failed login response
        login.mockRejectedValueOnce(new Error("Invalid credentials"));

        renderLogin();

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/Username/i), {
            target: { value: "wronguser" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "wrongpassword" },
        });

        // Simulate form submission
        fireEvent.click(screen.getByRole("button", { name: /Login/i }));

        // Wait for the error handling
        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                username: "wronguser",
                password: "wrongpassword",
            });
        });

        // Check if error message is displayed
        expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
    });
});
