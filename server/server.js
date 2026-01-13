require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json());


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


const codes = {};


app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const code = generateCode();
  
 
  codes[email] = {
    code,
    expires: Date.now() + 600000
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Code',
    text: `Your verification code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
    res.json({ message: 'Verification code sent' });
  });
});


app.post('/api/verify-code', (req, res) => {
  console.log('Verify code request received:', {
    email: req.body.email,
    code: req.body.code ? '****' + req.body.code.slice(-2) : 'no code provided',
    time: new Date().toISOString()
  });

  const { email, code } = req.body;
  
  if (!email || !code) {
    console.error('Missing email or code in request');
    return res.status(400).json({ error: 'Email and code are required' });
  }

  const storedCode = codes[email];
  console.log('Stored code for email:', {
    email,
    hasStoredCode: !!storedCode,
    storedCode: storedCode ? '****' + storedCode.code.slice(-2) : 'none',
    expires: storedCode ? new Date(storedCode.expires).toISOString() : 'n/a',
    currentTime: new Date().toISOString(),
    isExpired: storedCode ? Date.now() > storedCode.expires : 'n/a'
  });

  if (!storedCode) {
    console.error('No verification code found for email:', email);
    return res.status(400).json({ error: 'Invalid or expired code. Please request a new one.' });
  }

  if (storedCode.code !== code) {
    console.error('Code mismatch for email:', email);
    return res.status(400).json({ error: 'Invalid code. Please check and try again.' });
  }

  if (Date.now() > storedCode.expires) {
    console.error('Expired code for email:', email);
    delete codes[email];
    return res.status(400).json({ error: 'Code has expired. Please request a new one.' });
  }

  console.log('Code verified successfully for email:', email);

  
  res.json({ 
    message: 'Code verified',
    email: email
  });
});

// Reset password endpoint
app.post('/api/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  
  // In a real application, you would:
  // 1. Verify the user exists
  // 2. Hash the new password
  // 3. Update the user's password in the database
  // 4. Invalidate any existing sessions/tokens
  
  // For this example, we'll just log the password update
  // and return a success response
  console.log(`Password reset for ${email}`);
  
  // In a real app, you would generate a proper JWT token here
  const fakeToken = 'example-jwt-token-for-' + email;
  
  // Clear the verification code after successful password reset
  delete codes[email];
  
  res.json({ 
    message: 'Password has been reset successfully',
    token: fakeToken
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});