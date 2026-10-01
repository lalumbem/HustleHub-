import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

let mockAuthState;

vi.mock("../../context/AuthContext", () => ({
    useAuth: () => mockAuthState
}));

function renderProtected(role) {
    return render(
        <MemoryRouter
            initialEntries={["/dashboard"]}
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <Routes>
                <Route path="/login" element={<p>Login Page</p>} />
                <Route path="/" element={<p>Home Page</p>} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute role={role}>
                            <p>Secret Dashboard Content</p>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    );
}

describe("ProtectedRoute", () => {
    it("redirects to /login when there is no logged-in user", () => {
        mockAuthState = { user: null, loading: false };
        renderProtected();

        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(screen.queryByText("Secret Dashboard Content")).not.toBeInTheDocument();
    });

    it("shows the protected content once a user is loaded", () => {
        mockAuthState = { user: { id: "1", role: "client" }, loading: false };
        renderProtected();

        expect(screen.getByText("Secret Dashboard Content")).toBeInTheDocument();
    });

    it("redirects away when the user's role doesn't match the required role (RBAC in the UI)", () => {
        mockAuthState = { user: { id: "1", role: "client" }, loading: false };
        renderProtected("freelancer");

        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.queryByText("Secret Dashboard Content")).not.toBeInTheDocument();
    });

    it("shows a loading state before the auth check resolves", () => {
        mockAuthState = { user: null, loading: true };
        renderProtected();

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
});
