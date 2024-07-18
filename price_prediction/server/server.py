from flask import Flask, request, jsonify
import util
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

print("starting price_prediction/server")


@app.route('/get_location_names')
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.get_json()
    city = data['city']
    sqft_lot = float(data['sqft_lot'])
    bedrooms = int(data['bedrooms'])
    sqft_living = float(data['sqft_living'])

    response = jsonify({
        'estimated_price': util.get_estimated_price(city, bedrooms, sqft_living, sqft_lot)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    app.run()
