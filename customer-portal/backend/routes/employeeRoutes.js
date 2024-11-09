const express = require('express');
const router = express.Router();
const { loginEmployee } = require('../controllers/employeeController');
const PaymentModel = require('../models/paymentModel');

// Employee login route
router.post('/login', loginEmployee);

// Route to get all transactions
router.get('/transactions', async (req, res) => {
    try {
      const transactions = await PaymentModel.find({});
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error });
    }
  });

module.exports = router;

