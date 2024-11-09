const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Import helmet package for security headers
const https = require('https'); // Import https module
const fs = require('fs'); // Import fs module for file system
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Importing employee routes
const employeeRoutes = require('./routes/employeeRoutes');
require('dotenv').config();

const app = express();

// Use employee routes
app.use('/api/employees', employeeRoutes);

// Protects against clickjacking and other vulnerabilities
app.use(helmet());

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

// Importing employee routes
const employeeRoutes = require('./routes/employeeRoutes'); 

// Use user routes
app.use('/api/users', userRoutes);

// Use payment routes
app.use('/api/payments', paymentRoutes);

// Use employee routes
app.use('/api/employees', employeeRoutes); 

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
