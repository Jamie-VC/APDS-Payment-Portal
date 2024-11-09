const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Employee = require('./models/Employee');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        const employees = [
            { username: 'employee1', password: 'Passw0rd!' },
            { username: 'employee2', password: 'Secur3P@ss!' },
            { username: 'Lukus', password: 'Ihatethis00!' },
            { username: 'Arg', password: 'Nieman3P@ss!' }

        ];

        for (const emp of employees) {
            const existingEmployee = await Employee.findOne({ username: emp.username });
            if (!existingEmployee) {
                emp.password = await bcrypt.hash(emp.password, 10); // Ensure password is hashed
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
