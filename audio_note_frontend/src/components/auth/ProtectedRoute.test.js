import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { getAccessToken } from "../../utils/token";

// Mock the token utility
jest.mock("../../utils/token", () => ({
    getAccessToken: jest.fn(),
}));

describe("ProtectedRoute Component", () => {
    const ProtectedContent = () => <div>Protected Content</div>;

    it("redirects to /login when the user is not authenticated", () => {
        // Mock getAccessToken to return null (unauthenticated)
        getAccessToken.mockReturnValue(null);

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    {/* Protected route */}
                    <Route path="/protected" element={<ProtectedRoute />}>
                        <Route index element={<ProtectedContent />} />
                    </Route>
                    {/* Redirect route */}
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verify redirection to the login page
        expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
    });

    it("renders protected content when the user is authenticated", () => {
        // Mock getAccessToken to return a token (authenticated)
        getAccessToken.mockReturnValue("mocked-token");

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    {/* Protected route */}
                    <Route path="/protected" element={<ProtectedRoute />}>
                        <Route index element={<ProtectedContent />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        // Verify that the protected content is rendered
        expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
    });
});
