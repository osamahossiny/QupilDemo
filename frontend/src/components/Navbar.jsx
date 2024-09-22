import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const {logout} = useLogout()
    const { user } = useUserContext()
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* <h1 className="text-2xl font-bold">Quiz App</h1> */}
                <Link to={'/home'} className="text-2xl font-bold">Quiz App</Link>
                <div className="relative" ref={dropdownRef}>
                    {/* User icon */}
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-full p-2"
                    >
                        <FaUser className="text-xl" />
                        <span className="text-white">{user.username}</span>
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                            <Link
                                to="/history"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Quiz history
                            </Link>
                            <button
                                onClick={logout}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
