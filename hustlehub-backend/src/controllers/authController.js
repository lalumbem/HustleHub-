const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/userModel");

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = users.find(
            (user) => user.email === email
        );

        if (existingUser) {
            return res.status(409).json({
                message: "A user with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            id: Date.now().toString(),
            name,
            email, // already lower-cased by normalizeEmail() in validation
            password: hashedPassword,
            role: role || "client"
        };

        users.push(newUser);

        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = users.find((user) => user.email === email);

        // Deliberately identical response whether the email doesn't exist
        // or the password is wrong. Returning a different message for
        // "no such user" lets an attacker enumerate registered emails.
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};
