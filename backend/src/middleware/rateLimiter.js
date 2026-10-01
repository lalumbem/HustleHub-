const rateLimit = require("express-rate-limit");

const skipInTest = () => process.env.NODE_ENV === "test";

// Login and registration are the two endpoints most attractive to attackers
// (credential stuffing, brute force, account enumeration via mass sign-up).
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    skip: skipInTest,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many attempts from this IP. Please try again later."
    }
});

// Booking is the other sensitive endpoint: it creates a financial
// transaction record, so it gets its own, slightly more generous limit
// to stop scripted booking spam without blocking normal client use.
const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skip: skipInTest,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many booking attempts from this IP. Please try again later."
    }
});

// A loose baseline across the whole API, mainly to blunt naive scripted
// abuse/scraping rather than to police normal browsing traffic.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    skip: skipInTest,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests from this IP. Please try again later."
    }
});

module.exports = { authLimiter, bookingLimiter, apiLimiter };
