const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit'); // Import rate limiter package
require('dotenv').config();

const app = express();

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes.",
});

// Apply the rate limiter to all requests
app.use(limiter);

// Protects against clickjacking and other vulnerabilities
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "trusted.com"], // Avoid 'unsafe-inline'
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

// Use CORS middleware with support for multiple origins
const allowedOrigins = ['http://localhost:3000', 'https://localhost:3000'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Parse JSON bodies
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Importing routes
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const employeeRoutes = require('./routes/employeeRoutes'); 

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/employees', employeeRoutes); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Load SSL certificate and key
        const sslOptions = {
            key: fs.readFileSync('./SSL/private.key'), // Path to private key file
            cert: fs.readFileSync('./SSL/certificate.crt'), // Path to certificate file
            // Disable SSL certificate validation
            rejectUnauthorized: false
        };

        // Create HTTPS server and listen on the specified port
        https.createServer(sslOptions, app).listen(process.env.PORT, () => {
            console.log(`Listening on backend port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log('MongoDB connection error:', error);
    });