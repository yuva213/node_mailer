require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configure multer for file uploads (using memory storage for serverless)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Send email endpoint
app.post('/send-email', upload.array('attachments', 5), async (req, res) => {
    try {
        const { to, cc, bcc, subject, emailType, message, htmlMessage } = req.body;
        const files = req.files || [];

        // Build attachments array from memory
        const attachments = files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        }));

        // Build email options
        const mailOptions = {
            from: `"NodeMailer Web" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject
        };

        if (cc) mailOptions.cc = cc;
        if (bcc) mailOptions.bcc = bcc;

        // Set content based on email type
        if (emailType === 'html') {
            mailOptions.html = htmlMessage;
            mailOptions.text = message;
        } else {
            mailOptions.text = message;
        }

        // Add attachments if any
        if (attachments.length > 0) {
            mailOptions.attachments = attachments;
        }

        // Send email
        const info = await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Email sent successfully!',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Verify configuration endpoint
app.get('/verify', async (req, res) => {
    try {
        await transporter.verify();
        res.json({ success: true, message: 'SMTP configuration is valid!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Export for Vercel serverless
module.exports = app;
