import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function GigDetail() {
    const { id } = useParams();
    const { user } = useAuth();

    const [gig, setGig] = useState(null);
    const [error, setError] = useState("");
    const [bookingState, setBookingState] = useState("idle"); // idle | booking | booked | error
    const [bookingMessage, setBookingMessage] = useState("");

    useEffect(() => {
        api
            .getGig(id)
            .then((data) => setGig(data.gig))
            .catch((err) => setError(err.message));
    }, [id]);

    async function handleBook() {
        setBookingState("booking");
        setBookingMessage("");
        try {
            const data = await api.createBooking(id);
            setBookingState("booked");
            setBookingMessage(data.message);
        } catch (err) {
            setBookingState("error");
            setBookingMessage(err.message);
        }
    }

    if (error) return <p className="error-banner" role="alert">{error}</p>;
    if (!gig) return <p>Loading...</p>;

    // Only logged-in clients can book, and never their own gig — the
    // backend enforces both, this just avoids showing a button that
    // would only fail.
    const canBook = user?.role === "client" && gig.freelancerId !== user?.id;

    return (
        <div className="gig-detail">
            <h2>{gig.title}</h2>
            <p className="gig-category">{gig.category}</p>
            <p>{gig.description}</p>
            <p className="gig-price">R{Number(gig.price).toFixed(2)}</p>

            {canBook && (
                <button type="button" onClick={handleBook} disabled={bookingState === "booking"}>
                    {bookingState === "booking" ? "Booking..." : "Book this gig"}
                </button>
            )}

            {!user && <p>Log in as a client to book this gig.</p>}

            {bookingMessage && (
                <p className={bookingState === "booked" ? "success-banner" : "error-banner"} role="status">
                    {bookingMessage}
                </p>
            )}
        </div>
    );
}
