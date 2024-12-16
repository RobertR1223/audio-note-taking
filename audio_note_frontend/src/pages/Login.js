import React, { useState } from "react";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

const Login = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials);
            const { access, refresh } = response.data;

            // Store tokens in localStorage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // Redirect to the home page
            navigate("/");
        } catch {
            setError("Invalid username or password.");
        }
    };

    return (
        <AuthForm
            title="Login"
            onSubmit={handleLogin}
            error={error}
            buttonLabel="Login"
        />
    );
};

export default Login;
