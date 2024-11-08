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

module.exports = router;
