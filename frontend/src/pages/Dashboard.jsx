
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

function FreelancerDashboard() {
    const [gigs, setGigs] = useState([]);
    const [bookingData, setBookingData] = useState({
        bookings: [],
        transactions: [],
        totalIncome: 0,
        financialSummary: {
            grossIncome: 0,
            estimatedTax: 0,
            afterTaxIncome: 0,
            taxRate: 20
        }
    });
    const [error, setError] = useState("");

    async function loadGigs() {
        const data = await api.getMyGigs();
        setGigs(data.gigs);
    }

    useEffect(() => {
        Promise.all([api.getMyGigs(), api.getMyBookings()])
            .then(([gigData, bookingsData]) => {
                setGigs(gigData.gigs);
                setBookingData(bookingsData);
            })
            .catch((err) => setError(err.message));
    }, []);

    async function handleDelete(gigId) {
        try {
            await api.deleteGig(gigId);
            loadGigs();
        } catch (err) {
            setError(err.message);
        }
    }

    if (error) {
        return <p className="error-banner" role="alert">{error}</p>;
    }

    const finances = bookingData.financialSummary || {
        grossIncome: bookingData.totalIncome || 0,
        estimatedTax: 0,
        afterTaxIncome: bookingData.totalIncome || 0,
        taxRate: 20
    };

    const currency = (amount) =>
        `R${Number(amount || 0).toFixed(2)}`;

    return (
        <div>
            <h2>Freelancer Dashboard</h2>

            <section className="financial-summary" aria-labelledby="financial-heading">
                <h3 id="financial-heading">Financial Overview</h3>

                <div className="financial-cards">
                    <article className="financial-card">
                        <h4>Gross Income</h4>
                        <p>{currency(finances.grossIncome)}</p>
                        <small>Income from completed booking transactions</small>
                    </article>

                    <article className="financial-card">
                        <h4>Estimated Tax</h4>
                        <p>{currency(finances.estimatedTax)}</p>
                        <small>Illustrative {finances.taxRate}% estimate</small>
                    </article>

                    <article className="financial-card">
                        <h4>Income After Estimated Tax</h4>
                        <p>{currency(finances.afterTaxIncome)}</p>
                        <small>Gross income minus estimated tax</small>
                    </article>
                </div>

                <p className="income-summary">
                    Total income: <strong>{currency(bookingData.totalIncome)}</strong>
                    {" "}from {bookingData.bookings.length} booking(s)
                </p>

                <p className="tax-disclaimer">
                    Note: The 20% rate is an illustrative estimate for this
                    project. It is not an official SARS tax calculation or
                    personal tax advice.
                </p>
            </section>

            <div className="dashboard-header">
                <h3>Your gigs</h3>
                <Link to="/dashboard/gigs/new" className="button-link">
                    + New gig
                </Link>
            </div>

            {gigs.length === 0 && (
                <p>You haven't created any gigs yet.</p>
            )}

            <ul className="gig-list">
                {gigs.map((gig) => (
                    <li key={gig.id}>
                        <span>
                            {gig.title} — {currency(gig.price)}
                        </span>

                        <span className="gig-actions">
                            <Link to={`/dashboard/gigs/${gig.id}/edit`}>
                                Edit
                            </Link>

                            <button
                                type="button"
                                onClick={() => handleDelete(gig.id)}
                            >
                                Delete
                            </button>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ClientDashboard() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .getMyBookings()
            .then((data) => setBookings(data.bookings))
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return <p className="error-banner" role="alert">{error}</p>;
    }

    return (
        <div>
            <h2>My Bookings</h2>

            {bookings.length === 0 && (
                <p>
                    You haven't booked any gigs yet. Browse gigs to get started.
                </p>
            )}

            <ul className="gig-list">
                {bookings.map((booking) => (
                    <li key={booking.id}>
                        Gig #{booking.gigId} — {booking.status} —{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();

    return user.role === "freelancer"
        ? <FreelancerDashboard />
        : <ClientDashboard />;
}
