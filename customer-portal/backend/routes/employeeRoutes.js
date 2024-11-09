const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// Password validation function
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
}

// Create test employee when the server starts
async function createTestEmployee() {
    const testEmployee = {
        username: 'testuser',
        password: 'password123!', // This will be stored as plain text for now (or you can hash it)
    };

    try {
        // Check if the test employee already exists
        const existingEmployee = await Employee.findOne({ username: testEmployee.username });
        if (existingEmployee) {
            console.log('Test employee already exists');
            return;
        }

        // Validate the password
        if (!validatePassword(testEmployee.password)) {
            console.log('Password validation failed');
            return;
        }

        // Create new employee
        const newEmployee = new Employee(testEmployee);

        // Save the test employee to the database
        await newEmployee.save();
        console.log('Test employee created:', newEmployee);
    } catch (error) {
        console.error('Error creating test employee:', error.message);
    }
}

// Trigger the creation of the test employee when the server starts
createTestEmployee();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Log to check the incoming username
        console.log('Attempting login for:', username);

        // Find employee by username
        const employee = await Employee.findOne({ username });
        
        if (!employee) {
            console.log('Username not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        console.log('User found:', employee);

        // Compare password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        console.log('Password match successful');

        // Generate token
        const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated token:', token);

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
