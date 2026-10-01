const express = require("express");

const { createBooking, getMyBookings } = require("../controllers/bookingController");
const authenticateToken = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");
const { bookingValidation, validate } = require("../middleware/validationMiddleware");
const { bookingLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
    "/",
    bookingLimiter,
    authenticateToken,
    restrictTo("client"),
    bookingValidation,
    validate,
    createBooking
);

router.get(
    "/mine",
    authenticateToken,
    restrictTo("client", "freelancer"),
    getMyBookings
);

module.exports = router;
