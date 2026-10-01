const express = require("express");

const {
    getAllGigs,
    getGigById,
    getMyGigs,
    createGig,
    updateGig,
    deleteGig
} = require("../controllers/gigController");
const authenticateToken = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");
const {
    gigValidation,
    gigUpdateValidation,
    validate
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Public browsing — no auth required.
router.get("/", getAllGigs);

// Must be registered before "/:id" so "mine" isn't parsed as an id.
router.get("/mine", authenticateToken, restrictTo("freelancer"), getMyGigs);

router.get("/:id", getGigById);

router.post(
    "/",
    authenticateToken,
    restrictTo("freelancer"),
    gigValidation,
    validate,
    createGig
);

router.put(
    "/:id",
    authenticateToken,
    restrictTo("freelancer"),
    gigUpdateValidation,
    validate,
    updateGig
);

router.delete("/:id", authenticateToken, restrictTo("freelancer"), deleteGig);

module.exports = router;
