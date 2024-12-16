import React, { useState } from "react";

const AuthForm = ({ title, onSubmit, error, buttonLabel }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6"
        >
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">{title}</h2>
            <div className="mb-4">
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            >
                {buttonLabel}
            </button>
        </form>
    );
};

export default AuthForm;
