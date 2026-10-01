import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GigCard from "../GigCard";

const sampleGig = {
    id: "123",
    title: "Logo Design",
    description: "I will design a modern, minimal logo for your brand.",
    category: "Design",
    price: 500,
    freelancerId: "freelancer-1"
};

function renderWithRouter(ui) {
    return render(
        <MemoryRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            {ui}
        </MemoryRouter>
    );
}

describe("GigCard", () => {
    it("renders the gig's title, category, description and price", () => {
        renderWithRouter(<GigCard gig={sampleGig} />);

        expect(screen.getByText("Logo Design")).toBeInTheDocument();
        expect(screen.getByText("Design")).toBeInTheDocument();
        expect(
            screen.getByText("I will design a modern, minimal logo for your brand.")
        ).toBeInTheDocument();
        expect(screen.getByText("R500.00")).toBeInTheDocument();
    });

    it("links to the gig's detail page", () => {
        renderWithRouter(<GigCard gig={sampleGig} />);

        const link = screen.getByRole("link", { name: /view details/i });
        expect(link).toHaveAttribute("href", "/gigs/123");
    });

    it("renders a title containing a script tag as plain text, never as markup", () => {
        // Defence in depth check: even if sanitisation were ever bypassed
        // upstream, React must never execute this as HTML.
        const maliciousGig = { ...sampleGig, title: "<img src=x onerror=alert(1)>" };
        renderWithRouter(<GigCard gig={maliciousGig} />);

        expect(document.querySelector("img")).not.toBeInTheDocument();
        expect(screen.getByText("<img src=x onerror=alert(1)>")).toBeInTheDocument();
    });
});
