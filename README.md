# Price Prediction Server

This repository contains code for a price prediction App. Follow the instructions below to run the server and interact with its endpoints.

## How to Run the price prediction Server

1. **Start the Server**:
   To run the server, execute the following command:
   ```bash
   cd price_prediction/server
   python server.py
   ```

2. **Server Details**:
   - The server will be running on `http://127.0.0.1:5000`.

## API Endpoints

### 1. Fetch Available Locations

- **Endpoint**: `GET /get_location_names`
- **Description**: This endpoint fetches all the available locations.
- **URL**:
  ```
  http://127.0.0.1:5000/get_location_names
  ```

### 2. Predict Home Price

- **Endpoint**: `POST /predict_home_price`
- **Description**: This endpoint predicts the estimated price based on the provided inputs.
- **URL**:
  ```
  http://127.0.0.1:5000/predict_home_price
  ```
- **Inputs**:
  - `City` (string): The name of the city.
  - `Bedroom` (integer): The number of bedrooms.
  - `Sqft Living` (integer): The square footage of living space.
  - `Sqft Lot` (integer): The square footage of the lot.

## Example Usage

### Fetch Locations

```bash
curl -X GET http://127.0.0.1:5000/get_location_names
```

### Predict Home Price

```bash
curl -X POST http://127.0.0.1:5000/predict_home_price \
  -H "Content-Type: application/json" \
  -d '{"city": "Seattle", "bedrooms": 3, "sqft_living": 2000, "sqft_lot": 10000}'
```

for running `node index.js` and `node server.js`
```