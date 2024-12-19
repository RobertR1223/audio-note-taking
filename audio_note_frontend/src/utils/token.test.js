import { storeTokens, getAccessToken, clearTokens } from "./token";

describe("Token Utility Functions", () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        jest.clearAllMocks();
    });

    it("stores tokens in localStorage", () => {
        const mockAccessToken = "mocked-access-token";
        const mockRefreshToken = "mocked-refresh-token";

        // Call the function to store tokens
        storeTokens(mockAccessToken, mockRefreshToken);

        // Check if tokens are stored in localStorage
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "access_token",
            mockAccessToken
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "refresh_token",
            mockRefreshToken
        );

        // Verify directly from localStorage
        expect(localStorage.getItem("access_token")).toBe(mockAccessToken);
        expect(localStorage.getItem("refresh_token")).toBe(mockRefreshToken);
    });

    it("retrieves the access token from localStorage", () => {
        const mockAccessToken = "mocked-access-token";

        // Manually set an access token in localStorage
        localStorage.setItem("access_token", mockAccessToken);

        // Call the function to retrieve the access token
        const token = getAccessToken();

        // Verify the returned token
        expect(token).toBe(mockAccessToken);
    });

    it("clears tokens from localStorage", () => {
        // Set tokens in localStorage
        localStorage.setItem("access_token", "mocked-access-token");
        localStorage.setItem("refresh_token", "mocked-refresh-token");

        // Call the function to clear tokens
        clearTokens();

        // Check if tokens are removed from localStorage
        expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
        expect(localStorage.removeItem).toHaveBeenCalledWith("refresh_token");

        // Verify directly from localStorage
        expect(localStorage.getItem("access_token")).toBeNull();
        expect(localStorage.getItem("refresh_token")).toBeNull();
    });
});
