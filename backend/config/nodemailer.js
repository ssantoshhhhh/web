const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any service
  auth: {
    user: process.env.EMAIL_USER, // Your email here
    pass: process.env.EMAIL_PASS  // Your email password here
  }
});

// Function to send OTP
const sendOTP = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP for Verification',
    text: `Your OTP for email verification is: ${otp}`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
