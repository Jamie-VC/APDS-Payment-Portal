import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; 

const PaymentForm = () => {
  const location = useLocation(); 
  const { successMessage } = location.state || {}; 

  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    currency: '',
    provider: '',
    swiftCode: '',
    recipientName: '',
    recipientAccount: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({}); // State to hold error messages

  // Define regex patterns for validation
  const patterns = {
    amount: /^[0-9]+(\.[0-9]{1,2})$/, // Positive decimal number to 2 places
    currency: /^[A-Za-z]{3}$/, // 3 letters
    provider: /^[A-Za-z0-9 ]+$/, // Alphanumeric characters and spaces
    swiftCode: /^[A-Za-z]{1,}[A-Za-z0-9]{1,}([A-Za-z0-9]{0,})?$/, // Valid SWIFT/BIC format
    recipientName: /^[A-Za-z\s]+$/, // Letters and spaces
    recipientAccount: /^\d{5,16}$/, // 5 to 16 digit account number
};


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update payment details
    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    });

    // Validate input against regex patterns
    if (patterns[name] && !patterns[name].test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `Invalid ${name}. Please follow the format.`
      }));
    } else {
      // Clear the error for the field if valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if there are any errors before submission
    if (Object.values(errors).some(error => error)) {
      setMessage('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await fetch('https://localhost:4000/api/payments', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDetails),
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('Payment submitted successfully');
        //  clears the form fields
        setPaymentDetails({
          amount: '',
          currency: '',
          provider: '',
          swiftCode: '',
          recipientName: '',
          recipientAccount: ''
        });
      } else {
        setMessage(`Error: ${data.error || 'Payment submission failed'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Failed to submit payment. Please try again later.');
    }
  };

  return (
    <div>
      {successMessage && <p>{successMessage}</p>}
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={paymentDetails.amount}
          onChange={handleChange}
          placeholder="Enter amount (e.g., 100.00)"
          required
        />
        {errors.amount && <p className="error">{errors.amount}</p>} {/* Error message */}

        <label>Currency:</label>
        <input
          type="text"
          name="currency"
          value={paymentDetails.currency}
          onChange={handleChange}
          placeholder="letter currency code (e.g., ZAR)"
          required
        />
        {errors.currency && <p className="error">{errors.currency}</p>} {/* Error message */}

        <label>Provider:</label>
        <input
          type="text"
          name="provider"
          value={paymentDetails.provider}
          onChange={handleChange}
          placeholder="Provider name (e.g., ABSA)"
          required
        />
        {errors.provider && <p className="error">{errors.provider}</p>} {/* Error message */}

        <label>SWIFT Code:</label>
        <input
          type="text"
          name="swiftCode"
          value={paymentDetails.swiftCode}
          onChange={handleChange}
          placeholder="SWIFT/BIC code (e.g., ABSAZAJJ)"
          required
        />
        {errors.swiftCode && <p className="error">{errors.swiftCode}</p>} {/* Error message */}

        <label>Recipient Name:</label>
        <input
          type="text"
          name="recipientName"
          value={paymentDetails.recipientName}
          onChange={handleChange}
          placeholder="Recipient's name (e.g., Vincent Davis)"
          required
        />
        {errors.recipientName && <p className="error">{errors.recipientName}</p>} {/* Error message */}

        <label>Recipient Account Number:</label>
        <input
          type="text"
          name="recipientAccount"
          value={paymentDetails.recipientAccount}
          onChange={handleChange}
          placeholder="Account number (5-16 digits)"
          required
        />
        {errors.recipientAccount && <p className="error">{errors.recipientAccount}</p>} {/* Error message */}

        <button type="submit">Pay Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentForm;
