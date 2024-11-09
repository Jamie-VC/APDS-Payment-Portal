const express = require('express');
const router = express.Router();
const Payment = require('../models/paymentModel');

// Handle payment creation
router.post('/', async (req, res) => {
  const { amount, currency, provider, swiftCode, recipientName, recipientAccount } = req.body;

  try {
    const payment = await Payment.create({
      amount,
      currency,
      provider,
      swiftCode,
      recipientName,
      recipientAccount
    });
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Route to get all transactions (GET route)
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Payment.find({});  // Fetch all payments from the 'payments' collection
    res.status(200).json(transactions);  // Return the transactions in the response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

module.exports = router;
