const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  swiftCode: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientAccount: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
