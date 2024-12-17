import axios from "axios";

// Base API instance
const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

// Attach token to requests
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("access_token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

// Handle token refresh and retries for expired tokens
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 Unauthorized and no retry flag, attempt token refresh
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the access token
                const refreshToken = localStorage.getItem("refresh_token");

                if (refreshToken) {
                    const { data } = await axios.post(
                        "http://127.0.0.1:8000/api/token/refresh/",
                        { refresh: refreshToken }
                    );

                    // Save the new access token in localStorage
                    localStorage.setItem("access_token", data.access);

                    // Update the failed request with the new access token
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                    return API(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed. Logging out user.", refreshError);
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

// Auth APIs
export const login = (credentials) => API.post("token/", credentials);
export const register = (data) => API.post("users/", data);

// Notes APIs
export const fetchNotes = () => API.get("notes/");
export const createNote = (noteData) =>
    API.post("notes/", noteData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateNote = (id, noteData) =>
    API.put(`notes/${id}/`, noteData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteNote = (id) => API.delete(`notes/${id}/`);
