const express = require('express');
const helmet = require('helmet'); 
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet()); // helmet for basic security headers
app.use(cookieParser());
app.use(express.json());

// Protects against clickjacking and other vulnerabilities
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "trusted.com"], 
            styleSrc: ["'self'"], // Avoid 'unsafe-inline'
            objectSrc: ["'none'"], // Disables object elements (Flash, etc.)
            imgSrc: ["'self'", "trusted.com"], // Only allow images from trusted domains
            connectSrc: ["'self'"], // Controls where fetch, XHR, WebSocket requests can be made
            fontSrc: ["'self'"], // Restrict fonts to the same origin
            frameSrc: ["'none'"], // Disallow embedding in frames (clickjacking protection)
        }
    },
    crossOriginEmbedderPolicy: "require-corp", // Enforces strict cross-origin policies
}));

// Rate Limiter for Login Endpoint
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts. Please try again later.',
});

// CSRF Protection Middleware
const csrfProtection = csrf({ cookie: true });

// Login Employee Function
exports.loginEmployee = async (req, res) => {
    const { username, password } = req.body;

    // Input Validation using Regex
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Invalid username format' });
    }

    try {
        const employee = await Employee.findOne({ username });
        if (!employee) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: employee._id, role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send JWT as an HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
            maxAge: 3600000, // 1 hour in milliseconds
        }).status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Applying middlewares to the login route
app.post('/api/employees/login', loginLimiter, csrfProtection, exports.loginEmployee);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});