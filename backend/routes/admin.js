const nodemailer = require('nodemailer');

const predefinedEmail = 'adapaanjani567@gmail.com';
const predefinedPassword = 'admin123';
let generatedOtp = '';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adapaanjani567@gmail.com',
    pass: 'vswj krmm wfzn yeyy',
  },    
});

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const loginAdmin = (req, res) => {
  const { email, password } = req.body;
  if (email === predefinedEmail && password === predefinedPassword) {
    generatedOtp = generateOtp();
    const mailOptions = {
      from: 'pavankolli7532@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${generatedOtp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending OTP');
      } else {
        return res.status(200).send({ success: true });
      }
    });
  } else {
    return res.status(401).send('Invalid credentials');
  }
};

const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  console.log('Received OTP verification attempt:', { email, otp });
  if (email === predefinedEmail && otp === generatedOtp) {
    return res.status(200).send({ success: true });
  } else {
    return res.status(401).send('Invalid OTP');
  }
};

module.exports = { loginAdmin, verifyOtp };
