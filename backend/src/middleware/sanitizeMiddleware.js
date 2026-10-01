const xss = require("xss");

// Recursively strips/encodes anything that looks like HTML or script content
// from every string in req.body, req.query and req.params, so stored gig
// titles/descriptions etc. can never carry an XSS payload back out to
// another user's browser. This runs globally, before any route handler,
// as defence in depth alongside the field-level validation in
// validationMiddleware.js (which checks shape/length; this checks content).
//
// Note on injection: the current data layer is plain in-memory arrays
// searched with Array.find(), so SQL/NoSQL injection isn't reachable yet.
// When this is swapped for MongoDB/Mongoose, queries should stay
// parameterised (Mongoose does this by default) and `express-mongo-sanitize`
// should be added to strip any `$`/`.` operators an attacker tries to smuggle
// into a query key.

function sanitizeValue(value) {
    if (typeof value === "string") {
        return xss(value, { whiteList: {} }); // strip all tags, keep text
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value && typeof value === "object") {
        const cleaned = {};
        for (const key of Object.keys(value)) {
            cleaned[key] = sanitizeValue(value[key]);
        }
        return cleaned;
    }

    return value;
}

const sanitizeInput = (req, res, next) => {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) req.query = sanitizeValue(req.query);
    if (req.params) req.params = sanitizeValue(req.params);
    next();
};

module.exports = sanitizeInput;
