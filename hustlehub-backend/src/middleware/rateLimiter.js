const rateLimit = require("express-rate-limit");

// Login and registration are the two endpoints most attractive to attackers
// (credential stuffing, brute force, account enumeration via mass sign-up).
// This is deliberately separate from any general API rate limit so it can
// be tuned independently.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many attempts from this IP. Please try again later."
    }
});

module.exports = authLimiter;
