import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
    const navItems = [
        { name: "Weighted Dependency Graph", path: "/weight-graph" },
        { name: "Coupling Metrics", path: "/coupling-metrics" },
        { name: "Configurations", path: "/configs" },
    ];

    return (
        <header className="bg-black text-white flex justify-between items-center px-4 py-2">
            {/* Left Section */}
            <div className="flex items-center space-x-6">
                <h1 className="text-lg font-bold" onClick={
                    () => {window.location.href = "/"}
                }>InfraPulse</h1>
                <nav className="flex space-x-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md ${
                                    isActive
                                        ? "bg-teal-500 text-black"
                                        : ""
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative group">
                    <button className="text-white bg-gray-700 px-4 py-2 rounded-md focus:outline-none hover:bg-gray-600">
                        About Coupling Monitor ▾
                    </button>

                    {/* Dropdown Content */}
                    <div className="absolute top-full right-0 mt-1 bg-white text-black rounded-md shadow-lg hidden group-hover:flex flex-col z-10">
                        <ul className="w-48">
                            <li className="px-4 py-2 hover:bg-gray-200">
                                <a href="https://coupling-index-monitor.github.io/docs/">Website / Docs</a>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-200">
                                <a href="https://github.com/orgs/coupling-index-monitor/repositories">GitHub</a>
                            </li>
                            <hr className="border-t my-2" />
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
