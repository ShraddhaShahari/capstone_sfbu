const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

let users = [
  { email: 'user@example.com', name: 'John Doe', password: 'Password@123' }
];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const resetToken = Math.random().toString(36).substr(2);
  user.resetToken = resetToken;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset',
    text: `Hello ${user.name},\n\nPlease use the following link to reset your password:\n\nhttp://localhost:3001/pass_reset.html?token=${resetToken}\n\nThank you!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
    res.status(200).json({ message: 'Password reset email sent' });
  });
});

app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  const user = users.find(u => u.resetToken === token);

  if (!user) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  user.password = newPassword;
  delete user.resetToken;

  res.status(200).json({ message: 'Password reset successful' });
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3000');
});
