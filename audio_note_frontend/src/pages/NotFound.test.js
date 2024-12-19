import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound Component", () => {
    it("renders the 404 page content correctly", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        // Check for 404 title
        expect(screen.getByText("404")).toBeInTheDocument();

        // Check for "Page Not Found" heading
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();

        // Check for the descriptive message
        expect(
            screen.getByText(/The page you're looking for doesn't exist or has been moved./i)
        ).toBeInTheDocument();

        // Check for the link to Home
        const homeLink = screen.getByRole("link", { name: /Go back to Home/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute("href", "/");
    });

    it("displays a working Home link", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        const homeLink = screen.getByRole("link", { name: /Go back to Home/i });

        // Verify the link points to "/"
        expect(homeLink).toHaveAttribute("href", "/");
    });
});
