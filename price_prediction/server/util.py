import pickle
import json
import sklearn
import numpy as np

__locations = None
__data_columns = None
__model = None


def get_estimated_price(city, bedrooms, sqft_living, sqft_lot):
    if __locations is None:
        load_saved_artifacts()

    try:
        loc_index = __data_columns.index(city.lower())
    except:
        loc_index = -1

    x1 = np.zeros(len(__data_columns))
    x1[0] = bedrooms
    x1[1] = sqft_living
    x1[2] = sqft_lot

    if loc_index >= 0:
        x1[loc_index] = 1
    return round(__model.predict([x1])[0], 2)


def get_location_names():
    if __locations is None:
        load_saved_artifacts()
    return __locations


def load_saved_artifacts():
    print("loading saved artifacts...start")
    global __data_columns
    global __locations

    with open("./artifacts/columns.json", "r") as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]

        global __model
        with open('./artifacts/US_home_prices_model3.pickle', 'rb') as f:
            __model = pickle.load(f)
    print("loading saved artifacts...done")


if __name__ == '__main__':
    load_saved_artifacts()
    print(get_location_names())
    print(get_estimated_price('Algona', 3, 1390, 16000))
