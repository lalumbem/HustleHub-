import { Link } from "react-router-dom";

// Gig content (title/description) has already been sanitised server-side
// before storage, but React escapes all text content by default anyway
// (no dangerouslySetInnerHTML is used anywhere in this app), so this is
// safe from stored-XSS on the render side too.
export default function GigCard({ gig }) {
    return (
        <div className="gig-card">
            <h3>{gig.title}</h3>
            <p className="gig-category">{gig.category}</p>
            <p>{gig.description}</p>
            <p className="gig-price">R{Number(gig.price).toFixed(2)}</p>
            <Link to={`/gigs/${gig.id}`}>View details</Link>
        </div>
    );
}
