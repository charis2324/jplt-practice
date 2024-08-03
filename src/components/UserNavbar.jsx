import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function UserNavbar({ children }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');  // Redirect to home or login page after logout
    };

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/dashboard" className="text-xl font-bold">JPLT Practice</Link>
                    <div className="flex items-center space-x-4">
                        <span>{user.email}</span>
                        <Link to="/quiz" className="hover:text-blue-200">Quiz</Link>
                        <Link to="/profile" className="hover:text-blue-200">Profile</Link>
                        <button 
                            onClick={handleLogout}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
            <footer className="bg-gray-200 p-4 text-center">
                <p>&copy; 2024 JPLT Practice. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default UserNavbar;