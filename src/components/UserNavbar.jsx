import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import UsernameInput from "./UsernameInput";
import IconImage from "../assets/icon.png"
import Banner from "./Banner";

function UserNavbar({ children }) {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <nav className="bg-white shadow-md">
                <div className="container md:flex md:justify-between mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <Link to="/quiz" className="flex items-center align-center gap-2" state={{ resetQuiz: true }}>
                            <img src={IconImage} alt="icon" className="h-10 w-10 object-contain" />
                            <span className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">JPLT Practice</span>
                        </Link>
                        <button
                            className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
                            onClick={toggleMenu}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                    <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center md:space-x-6 mt-4 md:mt-0`}>
                        <span className="text-gray-600 font-medium py-2 md:py-0">{`Welcome, ${''}`}</span>
                        <Link to="/quiz" className="text-gray-700 hover:text-blue-600 transition duration-300 py-2 md:py-0 font-bold">Quiz</Link>
                        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition duration-300 py-2 md:py-0 font-bold">Dashboard</Link>
                        <Link to="/history" className="text-gray-700 hover:text-blue-600 transition duration-300 py-2 md:py-0 font-bold">History</Link>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 mt-2 md:mt-0"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <Banner />
            <main className="flex-grow container mx-auto p-4">
                {/* {hasUserAndProfile ? (
                    profile.display_name ? children : <UsernameInput />
                ) : null} */}
                {children}
            </main>
            <footer className="bg-gray-200 p-4 text-center">
                <p>&copy; 2024 JPLT Practice. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default UserNavbar;