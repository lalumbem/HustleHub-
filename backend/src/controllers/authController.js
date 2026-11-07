```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

function publicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
    };
}

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input types before using them in database operations.
        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string'
        ) {
            return res.status(400).json({ message: 'Invalid registration details.' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || normalizedEmail.length > 254) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }

        const existingUser = await User.findOne({
            email: { $eq: normalizedEmail }
        }).lean();

        if (existingUser) {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: role || 'client'
        });

        return res.status(201).json({
            message: 'User registered successfully.',
            user: publicUser(user)
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Reject non-string values before querying the database.
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid login details.' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || normalizedEmail.length > 254) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }

        const user = await User.findOne({
            email: { $eq: normalizedEmail }
        }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: publicUser(user)
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
```