require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer to use memory storage (works on all platforms)
const upload = multer({ storage: multer.memoryStorage() });

// Create transporter with IPv4 fallback
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    // Force IPv4 and add connection options
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    },
    // Disable IPv6
    localhost: 'localhost'
});

// Serve static files from current directory
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Send email endpoint
app.post('/send-email', upload.array('attachments', 5), async (req, res) => {
    try {
        const { to, cc, bcc, subject, emailType, message, htmlMessage } = req.body;
        const files = req.files || [];

        console.log('Received email request:', { to, subject, emailType, fileCount: files.length });

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
            mailOptions.text = message; // Fallback text
        } else {
            mailOptions.text = message;
        }

        // Add attachments if any
        if (attachments.length > 0) {
            mailOptions.attachments = attachments;
        }

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);

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
        console.log('Verifying SMTP configuration...');
        await transporter.verify();
        console.log('SMTP verification successful');
        res.json({ success: true, message: 'SMTP configuration is valid!' });
    } catch (error) {
        console.error('SMTP verification failed:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📧 Email sender ready!\n`);
});
