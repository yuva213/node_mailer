require('dotenv').config();
const nodemailer = require('nodemailer');

// ============================================
// NODEMAILER SAMPLE PROJECT
// ============================================

// Create transporter (reusable)
async function getTransporter() {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        // For custom SMTP, use:
        // host: process.env.EMAIL_HOST,
        // port: process.env.EMAIL_PORT,
        // secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
}

// Example 1: Send simple text email
async function sendSimpleEmail() {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: 'recipient@example.com',
        subject: 'Hello from NodeMailer!',
        text: 'This is a simple text email sent using NodeMailer.'
    });

    console.log('Simple email sent:', info.messageId);
}

// Example 2: Send HTML email
async function sendHtmlEmail() {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: 'recipient@example.com',
        subject: 'HTML Email from NodeMailer',
        text: 'This is the plain text version.',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Welcome!</h1>
                <p>This is an <strong>HTML email</strong> sent with NodeMailer.</p>
                <p style="color: #666;">You can use any HTML/CSS here.</p>
                <a href="https://example.com" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click Here</a>
            </div>
        `
    });

    console.log('HTML email sent:', info.messageId);
}

// Example 3: Send email with attachments
async function sendEmailWithAttachments() {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: 'recipient@example.com',
        subject: 'Email with Attachments',
        text: 'Please find the attached files.',
        html: '<p>This email contains attachments.</p>',
        attachments: [
            // Attach a file from disk
            {
                filename: 'sample.txt',
                path: './sample.txt'
            },
            // Attach file using content
            {
                filename: 'inline-content.txt',
                content: 'This file is created from string content!'
            },
            // Attach PDF or other files (uncomment and update path)
            // {
            //     filename: 'document.pdf',
            //     path: './documents/document.pdf'
            // }
        ]
    });

    console.log('Email with attachments sent:', info.messageId);
}

// Example 4: Send email to multiple recipients
async function sendBulkEmail() {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: 'person1@example.com, person2@example.com',
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
        subject: 'Bulk Email Example',
        text: 'This email is sent to multiple recipients.'
    });

    console.log('Bulk email sent:', info.messageId);
}

// Example 5: Verify SMTP configuration
async function verifyConfiguration() {
    const transporter = await getTransporter();

    try {
        await transporter.verify();
        console.log('✅ SMTP configuration is valid!');
    } catch (error) {
        console.error('❌ SMTP configuration error:', error.message);
    }
}

// ============================================
// MAIN - Run examples
// ============================================
async function main() {
    console.log('NodeMailer Sample Project\n');

    // First verify configuration
    await verifyConfiguration();
    console.log('\n');

    // Uncomment the example you want to run:

    // await sendSimpleEmail();
    // await sendHtmlEmail();
    // await sendEmailWithAttachments();
    // await sendBulkEmail();
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

// Export functions for use in other files
module.exports = {
    sendSimpleEmail,
    sendHtmlEmail,
    sendEmailWithAttachments,
    sendBulkEmail,
    verifyConfiguration,
    getTransporter
};
