import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";

const mockLogin = vi.fn();

vi.mock("../../context/AuthContext", () => ({
    useAuth: () => ({ login: mockLogin })
}));

function renderLogin() {
    return render(
        <MemoryRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <Login />
        </MemoryRouter>
    );
}

describe("Login page", () => {
    beforeEach(() => {
        mockLogin.mockReset();
    });

    it("renders email and password fields", () => {
        renderLogin();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("calls login with the entered credentials on submit", async () => {
        mockLogin.mockResolvedValue({ id: "1", role: "client" });
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByLabelText(/email/i), "client@example.com");
        await user.type(screen.getByLabelText(/password/i), "Password123");
        await user.click(screen.getByRole("button", { name: /log in/i }));

        expect(mockLogin).toHaveBeenCalledWith("client@example.com", "Password123");
    });

    it("shows the backend's error message, and only that message, on failed login", async () => {
        // Simulates what the real API client throws on a 401 — the UI must
        // surface only this generic message, never a stack trace or URL.
        mockLogin.mockRejectedValue(new Error("Invalid email or password."));
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByLabelText(/email/i), "client@example.com");
        await user.type(screen.getByLabelText(/password/i), "WrongPassword1");
        await user.click(screen.getByRole("button", { name: /log in/i }));

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent("Invalid email or password.");
        });
    });
});
