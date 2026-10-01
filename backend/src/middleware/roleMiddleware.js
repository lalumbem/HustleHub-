// Restricts a route to one or more roles. Must run after authenticateToken,
// which populates req.user from the verified JWT — this middleware never
// trusts anything from the request body/query for the role check.
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            // authenticateToken should always run first; this guards
            // against the middleware ever being wired up out of order.
            return res.status(401).json({ message: "Authentication required." });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to perform this action."
            });
        }

        next();
    };
};

module.exports = restrictTo;
