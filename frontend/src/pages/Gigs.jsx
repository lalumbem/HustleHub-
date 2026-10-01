import { useEffect, useState } from "react";
import { api } from "../api/client";
import GigCard from "../components/GigCard";

export default function Gigs() {
    const [gigs, setGigs] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .getGigs()
            .then((data) => setGigs(data.gigs))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading gigs...</p>;
    if (error) return <p className="error-banner" role="alert">{error}</p>;

    return (
        <div>
            <h2>Browse Gigs</h2>
            {gigs.length === 0 && <p>No gigs available yet.</p>}
            <div className="gig-grid">
                {gigs.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                ))}
            </div>
        </div>
    );
}
