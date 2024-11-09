const mongoose = require('mongoose');
const Employee = require('./models/Employee');

require('dotenv').config();

// Log the Employee model to verify the import
console.log(Employee); // This should output the model definition if it's correctly imported

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Seed data
        const employees = [
            { username: 'employee1', password: 'Passw0rd!' },
            { username: 'employee2', password: 'Secur3P@ss!' },
        ];

        // Hash passwords and insert into database
        for (const emp of employees) {
            // Log the typeof to ensure `findOne` is a function
            console.log(typeof Employee.findOne); // Should log 'function'

            const existingEmployee = await Employee.findOne({ username: emp.username });
            if (!existingEmployee) {
                const newEmployee = new Employee(emp);
                await newEmployee.save();
                console.log(`Inserted ${emp.username}`);
            } else {
                console.log(`Employee ${emp.username} already exists`);
            }
        }

        mongoose.disconnect();
        console.log('Seeding completed');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
