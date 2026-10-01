import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Gigs from "./pages/Gigs";
import GigDetail from "./pages/GigDetail";
import GigForm from "./pages/GigForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
    return (
        <>
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Gigs />} />
                    <Route path="/gigs/:id" element={<GigDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/gigs/new"
                        element={
                            <ProtectedRoute role="freelancer">
                                <GigForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/gigs/:id/edit"
                        element={
                            <ProtectedRoute role="freelancer">
                                <GigForm />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<p>Page not found.</p>} />
                </Routes>
            </main>
        </>
    );
}
