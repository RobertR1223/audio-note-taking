import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../../utils/token";

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!getAccessToken();

    const handleLogout = () => {
        clearTokens();
        navigate("/login");
    };

    return (
        <header className="bg-blue-500 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold">Audio Note-Taking App</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg ${
                                        isActive
                                            ? "bg-white text-blue-500 font-bold"
                                            : "hover:bg-blue-400"
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        {!isAuthenticated && (
                            <>
                                <li>
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-lg ${
                                                isActive
                                                    ? "bg-white text-blue-500 font-bold"
                                                    : "hover:bg-blue-400"
                                            }`
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/register"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-lg ${
                                                isActive
                                                    ? "bg-white text-blue-500 font-bold"
                                                    : "hover:bg-blue-400"
                                            }`
                                        }
                                    >
                                        Sign Up
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {isAuthenticated && (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition duration-300 ease-in-out"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
