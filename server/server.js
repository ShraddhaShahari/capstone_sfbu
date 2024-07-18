const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const pool = require('./dbConnect'); // Ensure you have dbConnect.js properly set up
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Debug logging to verify environment variables
console.log("Current directory:", __dirname);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("Environment variables not loaded correctly");
  process.exit(1);
}

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

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

// Route to add new property details
app.post('/property', async (req, res) => {
  async function insertProperty() {
    try {
      const imagePath = path.join(__dirname, '/new-image4.jpg');
      const imageBuffer = fs.readFileSync(imagePath);

      const query = `
        INSERT INTO property (
          bedroom, floors, living_area, view, lot_area, condition,
          above_ground, date_renovated, basement, street, date_added,
          city, price, upload_image, upload_image_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11, $12, $13, $14)
        RETURNING *;
      `;

      const values = [
        req.body.bedroom, req.body.floors, req.body.living_area, req.body.view, req.body.lot_area,
        req.body.condition, req.body.above_ground, req.body.date_renovated, req.body.basement, req.body.street,
        req.body.city, req.body.price, imageBuffer, path.basename(imagePath),
      ];

      const result = await pool.query(query, values);
      console.log('Data inserted successfully:', result.rows[0]);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error inserting data:', error.stack);
      res.sendStatus(400);
    }
  }
  insertProperty();
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
      console.log('Fetched property:', result.rows[0]); // Log fetched property
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Property not found');
    }
  } catch (error) {
    console.error('Error fetching property details:', error.stack);
    res.sendStatus(500);
  }
});

// Route to handle contact form submission
app.post('/send-message', async (req, res) => {
  console.log('Received form submission:', req.body);

  const { name, email, phone, message, agentEmail } = req.body;

  // Log all received fields
  console.log('Request body:', req.body);

  // Validate the agentEmail field
  if (!agentEmail) {
    console.error('Error: No recipient email address provided.');
    return res.status(400).send('Error: No recipient email address provided.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: email,
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
