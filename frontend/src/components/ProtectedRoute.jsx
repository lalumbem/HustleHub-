import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Gates a route behind login, and optionally behind a specific role.
 * This is a UX convenience only — the real enforcement is server-side
 * (JWT + RBAC middleware). A client could never actually create a gig
 * even if they bypassed this component, because the backend checks the
 * role independently on every request.
 */
export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    if (!user) return <Navigate to="/login" replace />;

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}
