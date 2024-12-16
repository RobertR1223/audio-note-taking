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

// Auth APIs
export const login = (credentials) => API.post("token/", credentials);
export const register = (data) => API.post("users/", data);

// Notes APIs
export const fetchNotes = () => API.get("notes/");
export const createNote = (noteData) => API.post("notes/", noteData);
export const updateNote = (id, noteData) => API.put(`notes/${id}/`, noteData);
export const deleteNote = (id) => API.delete(`notes/${id}/`);