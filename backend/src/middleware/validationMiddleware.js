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

const gigValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .isLength({ min: 3, max: 120 })
        .withMessage("Title must be between 3 and 120 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters."),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required.")
        .isLength({ max: 60 })
        .withMessage("Category is too long."),

    body("price")
        .notEmpty()
        .withMessage("Price is required.")
        .isFloat({ gt: 0, lt: 1000000 })
        .withMessage("Price must be a positive number.")
        .toFloat()
];

// Same field rules, but every field is optional since this is used for
// partial updates (PATCH-style behaviour on the PUT route).
const gigUpdateValidation = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 120 })
        .withMessage("Title must be between 3 and 120 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters."),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 60 })
        .withMessage("Category is too long."),

    body("price")
        .optional()
        .isFloat({ gt: 0, lt: 1000000 })
        .withMessage("Price must be a positive number.")
        .toFloat()
];

const bookingValidation = [
    body("gigId")
        .trim()
        .notEmpty()
        .withMessage("gigId is required.")
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
    gigValidation,
    gigUpdateValidation,
    bookingValidation,
    validate
};
