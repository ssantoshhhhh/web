const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('../config/nodemailer');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register User
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        const user = new User({ name, email, password: hashedPassword, role, otp });
        await user.save();

        await nodemailer.sendMail({
            to: email,
            subject: 'Verify Your Email',
            text: `Your OTP is ${otp}`,
        });

        res.status(201).json({ message: 'Registration successful, verify your email with OTP' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        user.isVerified = true;
        user.otp = '';
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'OTP verification failed', error });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) return res.status(400).json({ message: 'Invalid credentials or email not verified' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const otp = generateOTP();
        user.otp = otp;
        await user.save();

        await nodemailer.sendMail({
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otp}`,
        });

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = '';
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Password reset failed', error });
    }
};
