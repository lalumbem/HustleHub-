const { body, validationResult } = require("express-validator");

// Password max length matters here, not just min: bcrypt silently ignores
// bytes past 72, and hashing an attacker-supplied multi-megabyte string
// wastes CPU on every request (a cheap denial-of-service vector). Capping
// input length is standard practice before it ever reaches bcrypt.
const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("A valid email address is required.")
        .isLength({ max: 254 })
        .withMessage("Email address is too long.")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8, max: 72 })
        .withMessage("Password must be between 8 and 72 characters.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain a lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number."),

    body("role")
        .optional()
        .isIn(["client", "freelancer"])
        .withMessage("Invalid user role.")
];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("A valid email address is required.")
        .isLength({ max: 254 })
        .withMessage("Email address is too long.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ max: 72 })
        .withMessage("Password is too long.")
];

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed.",
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    validate
};
