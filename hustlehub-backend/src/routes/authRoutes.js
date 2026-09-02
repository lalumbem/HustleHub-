const express = require("express");

const { register, login } = require("../controllers/authController");
const {
    registerValidation,
    loginValidation,
    validate
} = require("../middleware/validationMiddleware");
const authLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
    "/register",
    authLimiter,
    registerValidation,
    validate,
    register
);

router.post(
    "/login",
    authLimiter,
    loginValidation,
    validate,
    login
);

module.exports = router;
