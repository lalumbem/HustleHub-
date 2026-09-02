const jwt = require("jsonwebtoken");

// Verifies the Bearer token on protected routes and attaches the decoded
// payload to req.user. Rejects missing, malformed, expired, or tampered
// tokens with a generic message (no detail on *why* it failed, to avoid
// giving an attacker a signal to iterate on).
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired authentication token."
        });
    }
};

module.exports = authenticateToken;
