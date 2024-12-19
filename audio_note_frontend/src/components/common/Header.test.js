import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { getAccessToken, clearTokens } from "../../utils/token";
import { useNavigate } from "react-router-dom";

// Mock utility functions
jest.mock("../../utils/token", () => ({
    getAccessToken: jest.fn(),
    clearTokens: jest.fn(),
}));

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("Header Component", () => {
    const renderHeader = () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders 'Home', 'Login', and 'Sign Up' when not authenticated", () => {
        getAccessToken.mockReturnValue(null); // Simulate unauthenticated state
        renderHeader();

        // Check for navigation links
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();

        // Logout button should not be present
        expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
    });

    it("renders 'Home' and 'Logout' when authenticated", () => {
        getAccessToken.mockReturnValue("mocked-token"); // Simulate authenticated state
        renderHeader();

        // Check for navigation links
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();

        // Login and Sign Up links should not be present
        expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Sign Up/i)).not.toBeInTheDocument();
    });

    it("calls clearTokens and navigates to '/login' on logout", () => {
        getAccessToken.mockReturnValue("mocked-token"); // Simulate authenticated state
        renderHeader();

        const logoutButton = screen.getByText(/Logout/i);
        fireEvent.click(logoutButton);

        // Verify clearTokens is called
        expect(clearTokens).toHaveBeenCalled();

        // Verify navigation to "/login"
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
