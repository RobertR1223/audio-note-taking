import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { getAccessToken } from "./utils/token";

// Mock the token utility
jest.mock("./utils/token", () => ({
    getAccessToken: jest.fn(),
}));

describe("App Component", () => {
    const renderWithRouter = (initialEntries = ["/"]) => {
        render(
            <MemoryRouter initialEntries={initialEntries}>
                <App />
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the Login page on /login", () => {
        renderWithRouter(["/login"]);

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    });

    it("renders the Register page on /register", () => {
        renderWithRouter(["/register"]);

        expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
    });

    it("renders the Home page for authenticated users", () => {
        // Mock user is authenticated
        getAccessToken.mockReturnValue("mocked-token");

        renderWithRouter(["/"]);

        expect(screen.getByText(/Manage Your Notes/i)).toBeInTheDocument();
    });

    it("redirects to login for unauthenticated users when accessing protected route", () => {
        // Mock user is unauthenticated
        getAccessToken.mockReturnValue(null);

        renderWithRouter(["/"]);

        // Since ProtectedRoute redirects, the Login page should render
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    it("renders the NotFound page for invalid routes", () => {
        renderWithRouter(["/non-existent-route"]);

        expect(screen.getByText(/404/i)).toBeInTheDocument();
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    });

    it("renders the Header component on every page", () => {
        renderWithRouter(["/"]);

        expect(screen.getByText(/Audio Note-Taking App/i)).toBeInTheDocument();
    });
});
