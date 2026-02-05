# Email Sender - NodeMailer Web App

A beautiful web interface to send emails using NodeMailer. Supports Plain Text, HTML emails, and File Attachments - all in one place!

## Features

- [x] **Plain Text Emails** - Simple text messages
- [x] **Styled HTML Emails** - Rich formatted emails
- [x] **File Attachments** - Upload multiple files
- [x] **Multiple Recipients** - To, CC, BCC support
- [x] **SMTP Verification** - Test configuration before sending
- [x] **Beautiful Web UI** - Modern, responsive design

---

## Quick Start (Local)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
PORT=3000
```

### 3. Run the Server

```bash
npm start
```

Open **http://localhost:3000** in your browser.

---

## Getting Gmail App Password

For Gmail, you need an App Password (not your regular password):

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to https://myaccount.google.com/apppasswords
4. Generate a new App Password
5. Use that 16-character password in `.env`

---

## Deployment Options

### Option 1: Render (Recommended - Free & Easy)

**Render** is the easiest platform for deploying Express apps like this.

#### Step 1: Push to GitHub

Make sure your code is on GitHub.

#### Step 2: Deploy on Render

1. Go to https://render.com
2. Sign up/Login
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name**: node-mailer (or any name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Click **Deploy**

#### Step 3: Add Environment Variables

After creating the service:
1. Go to your service → **Environment**
2. Add these variables:
   - `EMAIL_SERVICE` = `gmail`
   - `EMAIL_USER` = `your-email@gmail.com`
   - `EMAIL_APP_PASSWORD` = `your-app-password`
3. Save and wait for redeploy

#### Your App URL

Render will give you a URL like: `https://node-mailer.onrender.com`

---

### Option 2: Railway.app (Also Free & Good)

#### Step 1: Deploy on Railway

1. Go to https://railway.app
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repo
4. Railway will auto-detect Node.js

#### Step 2: Add Environment Variables

1. Go to **Variables** tab
2. Add:
   - `EMAIL_SERVICE` = `gmail`
   - `EMAIL_USER` = `your-email@gmail.com`
   - `EMAIL_APP_PASSWORD` = `your-app-password`
3. Click **Add** buttons

#### Step 3: Deploy

Railway will deploy automatically. Your URL will be like: `https://node-mailer.up.railway.app`

---

### Option 3: Fly.io (Free Tier Available)

#### Step 1: Install Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows
pwsh -c "iwr https://fly.io/install.ps1 | iex"
```

#### Step 2: Login & Deploy

```bash
fly auth login
fly launch
```

Follow the prompts, then:

```bash
fly secrets set EMAIL_SERVICE=gmail
fly secrets set EMAIL_USER=your-email@gmail.com
fly secrets set EMAIL_APP_PASSWORD=your-app-password
fly deploy
```

---

### Option 4: Vercel (More Complex - Serverless)

Vercel requires converting the Express app to serverless functions. The files are already configured in `/api` folder.

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Deploy

```bash
vercel
```

#### Step 3: Add Environment Variables

Go to your Vercel dashboard → Project Settings → Environment Variables and add:
- `EMAIL_SERVICE` = `gmail`
- `EMAIL_USER` = `your-email@gmail.com`
- `EMAIL_APP_PASSWORD` = `your-app-password`

Then redeploy.

---

## How to Use

### 1. Verify SMTP
Click the **"Verify SMTP"** button to check if your email configuration is correct.

### 2. Fill in Recipients
- **To**: Main recipient(s) - separate multiple with commas
- **CC**: Carbon copy recipients
- **BCC**: Blind carbon copy (hidden recipients)

### 3. Enter Subject
Your email subject line.

### 4. Choose Email Type

**Plain Text** [📝]
- Simple text message
- Works in all email clients

**Styled HTML** [🎨]
- Rich formatted content
- Use HTML tags for styling
- Include plain text fallback

### 5. Add Attachments (Optional)
- Drag & drop files OR click to browse
- Supports multiple files (up to 5)

### 6. Send Email
Click the **"Send Email"** button [🚀]

---

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook
```

### Yahoo Mail
```env
EMAIL_SERVICE=yahoo
```

### Custom SMTP
```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

---

## Project Structure

```
node_mailer/
├── server.js           # Express server (for local/Render/Railway)
├── index.js            # CLI examples
├── index.html          # Web UI
├── style.css           # Styling
├── script.js           # Frontend logic
├── package.json        # Dependencies
├── .env.example        # Config template
├── vercel.json         # Vercel config (for serverless)
├── api/                # Serverless functions (for Vercel)
│   ├── send-email.js
│   └── verify.js
└── uploads/            # Temp folder for attachments (local only)
```

---

## Troubleshooting

### "Cannot GET /" Error
- This happens on Vercel if serverless functions aren't configured correctly
- Use Render or Railway instead for easier deployment

### Email Not Sending
- Verify your App Password is correct
- Check that 2-Step Verification is enabled
- Make sure environment variables are set in deployment dashboard

### Port Already in Use
```bash
# Kill process on port 3000 (Linux/Mac)
kill -9 $(lsof -t -i:3000)

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Tips

- Gmail has daily sending limits (~500 emails/day for free accounts)
- Use App Passwords for better security
- Never commit `.env` to version control
- For bulk sending, consider SendGrid, Mailgun, or AWS SES
- Attached files are automatically deleted after sending

---

## License

ISC
