require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Handle GET at the root of this function
app.get('/', async (req, res) => {
    try {
        await transporter.verify();
        res.json({ success: true, message: 'SMTP configuration is valid!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = (req, res) => {
    app(req, res);
};
