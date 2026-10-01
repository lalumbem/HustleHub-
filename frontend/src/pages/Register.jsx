import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "client"
    });
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setSubmitting(true);

        try {
            await register(form.name, form.email, form.password, form.role);
            navigate("/login", { state: { registered: true } });
        } catch (err) {
            // Only ever show the backend's intentional, generic message —
            // never anything else that might leak internal detail.
            setError(err.message);
            if (err.fieldErrors) {
                const mapped = {};
                err.fieldErrors.forEach((fe) => {
                    mapped[fe.field] = fe.message;
                });
                setFieldErrors(mapped);
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="auth-form">
            <h2>Create an account</h2>
            {error && <p className="error-banner" role="alert">{error}</p>}
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required />
                {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}

                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                />
                {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}

                <label htmlFor="role">I am a</label>
                <select id="role" name="role" value={form.role} onChange={handleChange}>
                    <option value="client">Client (booking services)</option>
                    <option value="freelancer">Freelancer (offering services)</option>
                </select>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Creating account..." : "Register"}
                </button>
            </form>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
    );
}
