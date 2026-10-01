import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken, clearToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On load, if a token is already stored, verify it against the backend
    // rather than trusting whatever might be sitting in localStorage — the
    // server is always the source of truth for who the user is and what
    // role they hold.
    useEffect(() => {
        async function loadProfile() {
            if (!getToken()) {
                setLoading(false);
                return;
            }
            try {
                const data = await api.getProfile();
                setUser(data.user);
            } catch {
                clearToken();
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await api.login({ email, password });
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    const register = useCallback(async (name, email, password, role) => {
        await api.register({ name, email, password, role });
        // Registration doesn't log the user in automatically — they
        // confirm their details and log in explicitly, same as most
        // marketplaces.
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
