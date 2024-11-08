// routes/userRoutes.js

const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens
const User = require('../models/userModel'); 
const router = express.Router();

// POST /api/users/signup
router.post('/signup', async (req, res) => {
    const { name, surname, idNumber, accountNumber, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({ 
            name, 
            surname, 
            idNumber, 
            accountNumber, 
            password: hashedPassword // Save the hashed password
        });

        // Save user to the database
        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error occurred while registering user:', error);

        // Check for validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        // Check for duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ error: 'User with that ID number or account number already exists' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login function
const login = async (req, res) => {
    const { accountNumber, password } = req.body;
    try {
        const user = await User.findOne({ accountNumber });
        if (!user) {
            return res.status(401).json({ error: 'Invalid account number or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid account number or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error occurred during login:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




// Define the login route
router.post('/login', login); 

module.exports = router;
