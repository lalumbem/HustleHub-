import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <Link to="/" className="brand">HustleHub+</Link>
            <div className="nav-links">
                <Link to="/">Browse Gigs</Link>
                {user && <Link to="/dashboard">Dashboard</Link>}
                {!user && <Link to="/login">Login</Link>}
                {!user && <Link to="/register">Register</Link>}
                {user && (
                    <button type="button" onClick={handleLogout}>
                        Logout ({user.name})
                    </button>
                )}
            </div>
        </nav>
    );
}
