import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

const EMPTY_FORM = { title: "", description: "", category: "", price: "" };

// Used for both /dashboard/gigs/new and /dashboard/gigs/:id/edit.
// Ownership of an existing gig is enforced server-side — if this
// freelancer doesn't own the gig being edited, the update request will
// come back 403 and that message is shown, rather than the UI silently
// allowing something the backend will reject anyway.
export default function GigForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (!isEdit) return;
        api
            .getGig(id)
            .then((data) =>
                setForm({
                    title: data.gig.title,
                    description: data.gig.description,
                    category: data.gig.category,
                    price: String(data.gig.price)
                })
            )
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setSubmitting(true);

        const payload = { ...form, price: Number(form.price) };

        try {
            if (isEdit) {
                await api.updateGig(id, payload);
            } else {
                await api.createGig(payload);
            }
            navigate("/dashboard");
        } catch (err) {
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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="auth-form">
            <h2>{isEdit ? "Edit gig" : "Create a gig"}</h2>
            {error && <p className="error-banner" role="alert">{error}</p>}
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" value={form.title} onChange={handleChange} required />
                {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                />
                {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}

                <label htmlFor="category">Category</label>
                <input id="category" name="category" value={form.category} onChange={handleChange} required />
                {fieldErrors.category && <p className="field-error">{fieldErrors.category}</p>}

                <label htmlFor="price">Price (R)</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                />
                {fieldErrors.price && <p className="field-error">{fieldErrors.price}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : isEdit ? "Save changes" : "Create gig"}
                </button>
            </form>
        </div>
    );
}
