const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Cannot be reached without a valid, unexpired JWT.
router.get("/profile", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Authenticated user profile",
        user: req.user
    });
});

module.exports = router;
