require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle POST at the root of this function
app.post('/', upload.array('attachments', 5), async (req, res) => {
    try {
        const { to, cc, bcc, subject, emailType, message, htmlMessage } = req.body;
        const files = req.files || [];

        const attachments = files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        }));

        const mailOptions = {
            from: `"NodeMailer Web" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject
        };

        if (cc) mailOptions.cc = cc;
        if (bcc) mailOptions.bcc = bcc;

        if (emailType === 'html') {
            mailOptions.html = htmlMessage;
            mailOptions.text = message;
        } else {
            mailOptions.text = message;
        }

        if (attachments.length > 0) {
            mailOptions.attachments = attachments;
        }

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

// Vercel handler
module.exports = (req, res) => {
    app(req, res);
};
