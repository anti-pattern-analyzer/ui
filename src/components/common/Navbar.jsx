import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { clearAuthUser } from "@/store/user.js";

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(clearAuthUser());
        navigate("/login");
    };

    return (
        <header className="flex items-center justify-between h-14 px-4 border-b bg-white md:px-6 dark:bg-gray-950">
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                    <SunIcon className="w-5 h-5 fill-current" />
                    <span className="font-semibold">Astro Snap</span>
                </Link>
                <nav className={`flex space-x-4 md:flex md:items-center md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                    <Link to="/educational-news" className="block py-2 px-4 font-medium">Educational News</Link>
                </nav>
            </div>

            <div className="flex items-center">
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>

                {localStorage.getItem("token") ? (
                    <Button
                        className="ml-auto bg-red-800 text-white hover:bg-red-700 py-2 px-4"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : (
                    <Link to="/login" className="hidden md:block md:ml-auto">Login</Link>
                )}
            </div>
        </header>
    );
}

function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
        </svg>
    );
}

function CloseIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function SunIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </svg>
    );
}

export { Navbar };
