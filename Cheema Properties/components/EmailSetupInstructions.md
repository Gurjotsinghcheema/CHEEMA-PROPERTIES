# Email Service Setup Instructions for CHEEMA PROPERTIES

## Overview
This document explains how to set up the real email service to send inquiries to `balvircheema2016@gmail.com`.

## Method 1: Web3Forms (Recommended - Free)

### Step 1: Create Web3Forms Account
1. Go to https://web3forms.com
2. Sign up for a free account
3. Create a new form
4. Get your Access Key

### Step 2: Update Email Service
In `/components/EmailService.tsx`, replace:
```typescript
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_KEY';
```
With your actual access key from Web3Forms.

### Step 3: Configure Email Settings
The email service is already configured to send emails to:
- **Admin Email**: balvircheema2016@gmail.com
- **Customer Response**: Automated replies from balvircheema2016@gmail.com

## Method 2: EmailJS (Alternative)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com
2. Sign up for free account
3. Create email service (Gmail)
4. Create email template
5. Get Service ID, Template ID, and User ID

### Step 2: Update Email Service
Replace Web3Forms code with EmailJS implementation.

## Method 3: Custom SMTP (Advanced)

For production deployment, consider using:
- **Nodemailer** with Gmail SMTP
- **SendGrid** for reliable delivery
- **Amazon SES** for scalability

## Testing Email Service

### Local Testing
1. The current implementation logs all email attempts to console
2. Check browser console for "Email sent successfully" messages
3. Failed emails are stored in localStorage for admin review

### Production Testing
1. Submit a test inquiry through the form
2. Check balvircheema2016@gmail.com for new inquiry
3. Check customer email for automated response

## Email Templates

### Admin Notification Email
- **Subject**: 🏠 New Property Inquiry - [Customer Name]
- **To**: balvircheema2016@gmail.com
- **Content**: Customer details, requirements, contact info
- **Action Items**: Call/WhatsApp/Email customer

### Customer Response Email  
- **Subject**: 🏠 Thank you for your inquiry - CHEEMA PROPERTIES
- **From**: Balvir Singh Cheema <balvircheema2016@gmail.com>
- **Content**: Confirmation, next steps, contact information

## Security Notes

1. **Never commit API keys** to version control
2. Use environment variables for production
3. Enable CORS for your domain only
4. Monitor email quota and usage

## Troubleshooting

### Common Issues
1. **Emails not sending**: Check access key configuration
2. **Emails in spam**: Add sender to safe list
3. **CORS errors**: Configure allowed origins
4. **Rate limiting**: Respect service limits

### Debug Steps
1. Check browser console for errors
2. Verify network requests in DevTools
3. Test with different email addresses
4. Check service status pages

## Support

For issues with email setup:
1. Check Web3Forms documentation
2. Contact their support team
3. Review error logs in browser console
4. Test with minimal form data first