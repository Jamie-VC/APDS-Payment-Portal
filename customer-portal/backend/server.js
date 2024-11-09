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


// Use CORS middleware
app.use(cors({
    origin: 'https://localhost:3000',
}));

app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Importing user routes
const userRoutes = require('./routes/userRoutes');

// Importing payment routes
const paymentRoutes = require('./routes/paymentRoutes');

// Use user routes
app.use('/api/users', userRoutes);

// Use payment routes
app.use('/api/payments', paymentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Load SSL certificate and key
        const sslOptions = {
            key: fs.readFileSync('./SSL/private.key'), // Update the path to your key file
            cert: fs.readFileSync('./SSL/certificate.crt'), // Update the path to your certificate file
        };

        // Create HTTPS server
        https.createServer(sslOptions, app).listen(process.env.PORT, () => {
            console.log('Listening on port', process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });
