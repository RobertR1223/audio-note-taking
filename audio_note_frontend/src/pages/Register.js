import React, { useState } from "react";
import { register } from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

const Register = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (credentials) => {
        setError("");
        setSuccess(false);

        try {
            await register(credentials);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
        } catch {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <AuthForm
            title="Sign Up"
            onSubmit={handleRegister}
            error={error}
            buttonLabel="Sign Up"
        />
    );
};

export default Register;
