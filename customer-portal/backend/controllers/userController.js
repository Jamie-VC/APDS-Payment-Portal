const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize'); // NoSQL protection
const xss = require('xss'); // XSS protection
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Initialize CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

//rate limiter for signup and login requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes.",
});

// Signup function
const signup = async (req, res) => {
    // Sanitize input data - preventing NoSQL injection attack
    const name = sanitize(req.body.name);
    const surname = sanitize(req.body.surname);
    const idNumber = sanitize(req.body.idNumber);
    const accountNumber = sanitize(req.body.accountNumber);
    const password = sanitize(req.body.password);

    // Preventing XSS attacks
    const safeName = xss(name);
    const safeSurname = xss(surname);

    // Validate the input data
    if (!safeName || !safeSurname || !idNumber || !accountNumber || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ accountNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name: safeName,
            surname: safeSurname,
            idNumber,
            accountNumber,
            password: hashedPassword
        });
        res.status(201).json({ id: user._id, name: safeName, surname: safeSurname, accountNumber: user.accountNumber });
    } catch (error) {
        console.error('Error during signup:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error registering user' });
    }
};

// Login function
const login = async (req, res) => {
    const { accountNumber, password } = req.body;
    try {
        // Log received data
        console.log('Login attempt:', req.body);

        // Find user by account number
        const user = await User.findOne({ accountNumber });
        if (!user) return res.status(400).json({ error: 'User not found' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error); 
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    signup: [limiter, csrfProtection, signup], // Apply limiter and csrf protection
    login: [limiter, csrfProtection, login] // Apply limiter and csrf protection
};