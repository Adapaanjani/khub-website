const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pavankolli7532@gmail.com',
    pass: 'vswj krmm wfzn yeyy',
  },
});

function sendContactMail(name, email, message) {
  const mailOptions = {
    from: 'pavankolli7532@gmail.com',
    to: 'scb.21jn1a45b1.tanmayi@gmail.com',
    subject: 'New Contact Message',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendContactMail };
