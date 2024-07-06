const express = require('express');
const pool = require('./dbConnect');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3005;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow these methods
  allowedHeaders: ['Content-Type'], // Allow these headers
}));

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
    const result = await pool.query(
        'select * from property'
    );
    res.json({
        res: result["rows"]
    });
});


app.delete('/property/:id', async (req, res) => {
    const propertyId = req.params.id;
    try {
      const query = 'DELETE FROM property WHERE id = $1 RETURNING *;';
      const result = await pool.query(query, [propertyId]);
  
      if (result.rowCount > 0) {
        res.status(200).json({
          message: 'Property deleted successfully',
          data: result.rows[0]
        });
      } else {
        res.status(404).json({
          message: 'Property not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting property',
        error: error.message
      });
    }
  });
    

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

      const values = [req.body["bedroom"], req.body["floors"], req.body["living_area"], req.body["view"], req.body["lot_area"], 
      req.body["condition"], req.body["above_ground"], req.body["date_renovated"], req.body["basement"], req.body["street"], 
      req.body["city"], req.body["price"], req.body["upload_image"], req.body["upload_image_name"]]
  
      const result = await pool.query(query, values);
      console.log('Data inserted successfully:', result.rows[0]);
    } catch (error) {
      console.error('Error inserting data:', error.stack);
      res.sendStatus(400)
    }
    res.sendStatus(200)
  }
  insertProperty();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
