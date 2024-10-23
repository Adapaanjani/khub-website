const express = require('express');
const router = express.Router();
const { sendContactMail } = require('./contact');

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendContactMail(name, email, message);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send message');
  }
});

module.exports = router;
