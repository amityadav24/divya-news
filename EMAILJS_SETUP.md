# EmailJS Setup Instructions

## Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email

## Step 2: Add Email Service

1. Go to **Email Services** → **Add New Service**
2. Choose **Gmail**
3. Connect your Gmail account: `divyanews010@gmail.com`
4. Service ID will be generated (e.g., `service_divyanews`)

## Step 3: Create Email Template

1. Go to **Email Templates** → **Create New Template**
2. Template Name: `Contact Form`
3. Template ID: `template_contact`
4. Template Content:

```
Subject: New Contact Form Submission - {{subject}}

From: {{name}}
Email: {{email}}

Message:
{{message}}

---
This message was sent from Divya News contact form.
```

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key**

## Step 5: Update Frontend

1. Open `frontend/contact.html`
2. Line 26: Replace `YOUR_PUBLIC_KEY` with your actual public key
3. Line 289: Update service ID if different from `service_divyanews`
4. Line 289: Update template ID if different from `template_contact`

## Example Configuration

```javascript
// Initialize EmailJS
emailjs.init("YOUR_ACTUAL_PUBLIC_KEY");

// Send email
await emailjs.send('service_divyanews', 'template_contact', {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test',
    message: 'Hello',
    to_email: 'divyanews010@gmail.com'
});
```

## Testing

1. Fill out contact form on website
2. Submit
3. Check `divyanews010@gmail.com` inbox
4. Email should arrive within seconds

## Free Tier Limits

- 200 emails/month
- Upgrade if needed for more

---

**Note**: Keep your public key safe but it's okay to expose in frontend code.
