const express = require('express');
const { loginAdmin, verifyOtp } = require('./admin');

const router = express.Router();

router.post('/login', (req, res) => {
  try {
    loginAdmin(req, res);
  } catch (error) {
    console.error('Error in /login route:', error.message); // Include detailed error message
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/verify-otp', (req, res) => {
  try {
    verifyOtp(req, res);
  } catch (error) {
    console.error('Error in /verify-otp route:', error.message); // Include detailed error message
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
