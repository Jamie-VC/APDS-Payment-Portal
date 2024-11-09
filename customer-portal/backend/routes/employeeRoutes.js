const express = require('express');
const router = express.Router();
const { loginEmployee } = require('../controllers/employeeController');

// Employee login route
router.post('/login', loginEmployee);

module.exports = router;

