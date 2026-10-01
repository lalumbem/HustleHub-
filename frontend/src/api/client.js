// Base URL of the HustleHub+ backend. Override via a .env file
// (VITE_API_BASE_URL=...) for non-local setups.
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "" : "https://localhost:3000");

// JWT is kept in localStorage for simplicity in this assessment. Note:
// an httpOnly cookie set by the server is the more XSS-resistant place to
// keep an auth token in production, since JS (and therefore any injected
// script) can't read it. localStorage is used here so the token can be
// attached manually to each request without needing cookie/CORS
// credential plumbing — documented as a known trade-off in the README.
const TOKEN_KEY = "hustlehub_token";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Thin fetch wrapper. Never surfaces raw network/server internals to the
 * UI — only the `message` field the backend intentionally sends, or a
 * generic fallback, so nothing like a stack trace or URL ever reaches the
 * screen.
 */
async function request(path, { method = "GET", body, auth = false } = {}) {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
    } catch (networkError) {
        throw new Error("Could not reach the server. Please try again.");
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        // No JSON body (e.g. some 204s) — that's fine.
    }

    if (!response.ok) {
        const message = data?.message || "Something went wrong. Please try again.";
        const error = new Error(message);
        error.status = response.status;
        error.fieldErrors = data?.errors || null;
        throw error;
    }

    return data;
}

export const api = {
    register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
    login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
    getProfile: () => request("/api/users/profile", { auth: true }),

    getGigs: () => request("/api/gigs"),
    getGig: (id) => request(`/api/gigs/${id}`),
    getMyGigs: () => request("/api/gigs/mine", { auth: true }),
    createGig: (payload) => request("/api/gigs", { method: "POST", body: payload, auth: true }),
    updateGig: (id, payload) => request(`/api/gigs/${id}`, { method: "PUT", body: payload, auth: true }),
    deleteGig: (id) => request(`/api/gigs/${id}`, { method: "DELETE", auth: true }),

    createBooking: (gigId) => request("/api/bookings", { method: "POST", body: { gigId }, auth: true }),
    getMyBookings: () => request("/api/bookings/mine", { auth: true })
};
