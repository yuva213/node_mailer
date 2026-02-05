# Email Sender - NodeMailer Web App

A beautiful web interface to send emails using NodeMailer. Supports Plain Text, HTML emails, and File Attachments - all in one place!

## Features

- 📝 **Plain Text Emails** - Simple text messages
- 🎨 **Styled HTML Emails** - Rich formatted emails
- 📎 **File Attachments** - Upload multiple files
- 👥 **Multiple Recipients** - To, CC, BCC support
- ✅ **SMTP Verification** - Test configuration before sending
- 🌐 **Beautiful Web UI** - Modern, responsive design

## Setup

1. **Dependencies are already installed**

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env`** with your email credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-app-password
   PORT=3000
   ```

## Getting Gmail App Password

For Gmail, you need an App Password (not your regular password):

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Generate a new App Password
5. Use that 16-character password in `.env`

## Run the Web Server

```bash
npm start
```

Then open your browser to: **http://localhost:3000**

## How to Use

### 1. Click "Verify SMTP" button
Check if your email configuration is correct.

### 2. Fill in Recipients
- **To**: Main recipient(s) - separate multiple with commas
- **CC**: Carbon copy recipients
- **BCC**: Blind carbon copy (hidden recipients)

### 3. Enter Subject
Your email subject line.

### 4. Choose Email Type

**Plain Text** 📝
- Simple text message
- Works in all email clients

**Styled HTML** 🎨
- Rich formatted content
- Use HTML tags for styling
- Include plain text fallback for clients that don't support HTML

### 5. Add Attachments (Optional)
- Drag & drop files OR
- Click to browse
- Supports multiple files

### 6. Click "Send Email" 🚀

## Project Structure

```
node_mailer/
├── server.js           # Express server
├── index.js            # CLI examples (optional use)
├── .env.example        # Config template
├── package.json        # Dependencies
├── public/
│   ├── index.html      # Web UI
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
└── uploads/            # Temp folder for attachments
```

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook
```

### Yahoo
```env
EMAIL_SERVICE=yahoo
```

### Custom SMTP
```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## Tips

- Gmail has daily sending limits (~500 emails/day for free accounts)
- Use App Passwords for better security
- Never commit `.env` to version control
- For bulk sending, consider SendGrid, Mailgun, or AWS SES
- Attached files are automatically deleted after sending
