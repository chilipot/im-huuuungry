import json
from flask_cors import CORS
import controllers.restaurant_service as rest_service
from flask import Flask, jsonify, request

from models.models import Restaurant

WT_INCR = 1

app = Flask(__name__)
CORS().init_app(app)

@app.route('/')
def index():
    return "Why would you make the API call the root URI"

@app.route('/restaurants')
def get_scored_restaurants():
    """
    Calculates the scores for all the restaurants. The wrapper for all the backend functionality.
    """
    wt_loc = request.args.get("wt_loc", 1, float)
    wt_rating = request.args.get("wt_rating", 1, float)
    wt_price = request.args.get("wt_price", 1, float)
    raw_coords = request.args.get("coords", type=str)
    coords = raw_coords.split(",") if raw_coords is not None else ("0", "0")
    cuisine = request.args.get("cuisine", None, str)
    use_cache = request.args.get("use_cache", False, bool)
    if use_cache:
        with open(f"{cuisine}_data.json", "r") as f:
            restaurants = [Restaurant(**r) for r in json.load(f) or []]
    else:
        restaurants = rest_service.get_restaurants(coords=coords, keyword=cuisine)
    restaurants_by_id = rest_service.restaurants_by_id(restaurants)
    scored_restaurant_ids_curr = rest_service.scored_restaurant_ids(restaurants,
                                                                    wt_loc,
                                                                    wt_rating,
                                                                    wt_price)
    scored_restaurant_ids_up_loc = rest_service.scored_restaurant_ids(restaurants,
                                                                      wt_loc + WT_INCR,
                                                                      wt_rating,
                                                                      wt_price)
    scored_restaurant_ids_up_price = rest_service.scored_restaurant_ids(restaurants,
                                                                        wt_loc,
                                                                        wt_rating,
                                                                        wt_price + WT_INCR)
    json_compatible_rests_by_id = {k: v.__dict__ for k, v in restaurants_by_id.items()}
    return jsonify({
        "by_id": json_compatible_rests_by_id,
        "ids": scored_restaurant_ids_curr,
        "ids_loc_branch": scored_restaurant_ids_up_loc,
        "ids_price_branch": scored_restaurant_ids_up_price
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
