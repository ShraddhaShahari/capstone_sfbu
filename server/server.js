const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const pool = require('./dbConnect');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const upload = multer({ dest: 'uploads' });
const app = express();
const PORT = 3005;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Specify the views directory


app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the Server!');
});

// Debug logging to verify environment variables
console.log("Current directory:", __dirname);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.JWT_SECRET) {
  console.error("Environment variables not loaded correctly");
  process.exit(1);
}

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const jwtSecret = process.env.JWT_SECRET;


// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});


// Middleware for JWT verification
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ error: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded.id;
    next();
  });
}

// Route to fetch all properties available on listings page
app.get('/properties', async (req, res) => {
  async function createPropertyTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS property (
          id SERIAL PRIMARY KEY,
          bedroom INT NOT NULL,
          floors INT NOT NULL,
          living_area FLOAT NOT NULL,
          view VARCHAR(100),
          lot_area FLOAT NOT NULL,
          condition VARCHAR(50),
          above_ground FLOAT,
          date_renovated DATE,
          basement FLOAT,
          street VARCHAR(255),
          date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          city VARCHAR(100),
          price DECIMAL(12, 2) NOT NULL,
          upload_image BYTEA,
          upload_image_name VARCHAR(255)
        );
      `;
      const res = await pool.query(query);
      console.log("Table created successfully", res);
    } catch (err) {
      console.error("Error creating table", err.stack);
    }
  }
  createPropertyTable();
  const result = await pool.query('SELECT * FROM property');
  res.json({
    res: result.rows,
  });
});

// Route to add new property details
app.post('/property', upload.single('upload_image'), async (req, res) => {
  
  try {
    console.log('Received data:', req.body);
    console.log('Uploaded file:', req.file);

    const {
      bedroom, floors, living_area, view, lot_area,
      condition, above_ground, date_renovated, basement,
      street, city, price
    } = req.body;

    const file = req.file;
    const upload_image = file ? fs.readFileSync(file.path) : null;
    const upload_image_name = file ? file.originalname : null;
    
    console.log("print:", req.body)


    const query = `
      INSERT INTO property (
        bedroom, floors, living_area, view, lot_area, condition,
        above_ground, date_renovated, basement, street,
        city, price, upload_image, upload_image_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const values = [
      bedroom, floors, living_area, view, lot_area,
      condition, above_ground, date_renovated, basement, street,
      city, price, upload_image, upload_image_name
    ];

    console.log('Inserting values:', values);
    const result = await pool.query(query, values);
    console.log('Data inserted successfully:', result.rows[0]);
    res.status(200).json({ property: result.rows[0] });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(400).json({ error: error.message });
  }
});


// Route to fetch property details by ID
app.get('/property/:id', async (req, res) => {
  const propertyId = parseInt(req.params.id);
  if (isNaN(propertyId)) {
    return res.status(400).json({ error: 'Invalid property ID' });
  }

  try {
    const query = 'SELECT * FROM property WHERE id = $1';
    const result = await pool.query(query, [propertyId]);
    if (result.rows.length > 0) {
      console.log('Fetched property:', result.rows[0]);
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Property not found');
    }
  } catch (error) {
    console.error('Error fetching property details:', error.stack);
    res.sendStatus(500);
  }
});

// Route to delete property details by ID
app.delete('/property/:id', async (req, res) => {
  const propertyId = parseInt(req.params.id);
  if (isNaN(propertyId)) {
    return res.status(400).json({ error: 'Invalid property ID' });
  }

  try {
    const query = 'DELETE FROM property WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [propertyId]);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: 'Property deleted successfully',
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        message: 'Property not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting property',
      error: error.message,
    });
  }
});

// Route to handle contact form submission
app.post('/send-message', async (req, res) => {
  console.log('Received form submission:', req.body);

  const { name, email, phone, message, agentEmail } = req.body;

  console.log('Request body:', req.body);

  if (!agentEmail) {
    console.error('Error: No recipient email address provided.');
    return res.status(400).send('Error: No recipient email address provided.');
  }

  const mailOptions = {
    from: emailUser,
    to: agentEmail,
    subject: 'New Contact Form Submission',
    text: `You have a new message from:
    
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Message: ${message}`,
  };

  try {
    console.log('Sending email with options:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send(`Error sending message: ${error.message}`);
  }
});

// Forgot Password functionality
let users = [
  { email: 'hartej.0506@gmail.com', name: 'Hartej', password: 'Password@123' },
  { email: 'shraddhashahari7@gmail.com', name: 'Shraddha', password: 'Password@123' },
  { email: 'rupalirkate2015@gmail.com', name: 'Rupali', password: 'Password@123' },
  { email: 'rupaliskale21@gmail.com', name: 'Rupali1', password: 'Password@123' }
];

app.post('/forgot-password', (req, res) => {
  console.log('POST /forgot-password request received');
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    console.log('User not found');
    return res.status(404).json({ error: 'User not found' });
  }

  const resetToken = Math.random().toString(36).substr(2);
  user.resetToken = resetToken;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset',
    text: `Hello ${user.name},\n\nPlease use the following link to reset your password:\n\nhttp://localhost:3005/reset_password?token=${resetToken}\n\nThank you!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
    console.log('Password reset email sent:', info.response);
    res.status(200).json({ message: 'Password reset email sent' });
  });
});

// Route to render the reset password page
app.get('/reset_password', (req, res) => {
  const { token } = req.query;
  res.render('reset_password', { token });
});

// Route to handle password reset
app.post('/reset-password', (req, res) => {
  console.log('POST /reset-password request received');
  const { token, newPassword } = req.body;
  const user = users.find(u => u.resetToken === token);

  if (!user) {
    console.log('Invalid token');
    return res.status(400).json({ error: 'Invalid token' });
  }

  // Update the user's password
  user.password = newPassword; // You may want to hash the password here
  delete user.resetToken;

  console.log('Password reset successful for user:', user.email);
  res.status(200).json({ message: 'Password reset successful' });
});

// Route to serve the forgot_password.html file
app.get('/forgot_password', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forgot_password.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
