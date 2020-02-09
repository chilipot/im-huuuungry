import os
import time

from models import Restaurant, ScoredRestaurant
from score_service import Scorer
from utils import make_request
from utils import meters_to_miles

NEARBY_PLACE_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
DISTANCE_MATRIX_API_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
RESTAURANT_TYPE = "restaurant"


def get_scored_restaurants(wt_loc, wt_rating, wt_price, **kwargs):
    """
    Calculates the scores for all the restaurants. The wrapper for all the backend functionality.

    :param wt_loc: The importance of the location of the restaurant, float from 0 to 1
    :param wt_rating: The importance of the rating of the restaurant, float from 0 to 1
    :param wt_price: The importance of the price of the restaurant, float from 0 to 1
    :param kwargs: All args to get_restaurants
    :return:
    """
    restaurants = get_restaurants(**kwargs)
    scored_restaurants = add_scores(restaurants, wt_loc, wt_rating, wt_price)
    return scored_restaurants


def get_restaurants(coords, radius=None, maxprice=2, keyword=None, count=20):
    """
    Uses Google's API to get a list of nearby restaurants

    :param coords: A tuple of coordinates (latitude, longitude)
    :param radius: Radius in meters
    :param maxprice: The maximum amount of $'s allowed in a restaurant recommended by the algo
    :param keyword: Search term, e.g. "burgers", "pizza", "Chinese", etc.
    :param count: The number of restaurants to request
    :return: List of objects representing restaurants
    """
    raw_restaurants = []
    params = {
        "key": GOOGLE_API_KEY,
        "location": ",".join(coords),
        "maxprice": maxprice,
        "opennow": True,  # TODO: Implement proper open hours prediction
        "type": RESTAURANT_TYPE
    }
    if keyword:
        params["keyword"] = keyword
    if radius:
        params["radius"] = radius
    else:
        params["rankby"] = "distance"

    next_page = None
    while len(raw_restaurants) < count:
        pagination_params = {
            "key": GOOGLE_API_KEY,
            "pagetoken": next_page
        }
        resp = make_request(NEARBY_PLACE_API_URL, params=(params if next_page is None else pagination_params))
        raw_restaurants.extend(resp["results"])
        if not resp.get("next_page_token"):
            break
        next_page = resp["next_page_token"]
        time.sleep(1)

    raw_restaurants = add_travel_info(raw_restaurants, coords)
    restaurants = [Restaurant.from_api_resp(raw_rest) for raw_rest in raw_restaurants]
    return restaurants


def add_travel_info(raw_rests, coords):
    """Adds travel info"""
    params = {
        "key": GOOGLE_API_KEY,
        "units": "imperial",
        "origins": ",".join(coords)
    }

    modes = [
        {"mode": "driving"},
        {"mode": "walking"},
        {"mode": "transit", "transit_mode": "rail|bus"}
    ]

    dists_by_mode = {}
    dists_calc = 0
    while dists_calc < len(raw_rests):
        ids = [f"place_id:{r['place_id']}" for r in raw_rests[dists_calc:dists_calc+25]]
        dests_str = "|".join(ids)

        for mode in modes:
            resp = make_request(DISTANCE_MATRIX_API_URL, params={**params, **mode, "destinations": dests_str})
            result_list = resp["rows"][0]["elements"]
            if mode["mode"] in dists_by_mode:
                dists_by_mode[mode["mode"]].extend(result_list)
            else:
                dists_by_mode[mode["mode"]] = result_list

        dists_calc += len(ids)

    def parse_travel_info(travel_info_obj):
        return {"duration": travel_info_obj["duration"]["value"],
                "distance": meters_to_miles(travel_info_obj["distance"]["value"])}

    for ind, rest in enumerate(raw_rests):
        rest["travel_info"] = {mode["mode"]: parse_travel_info(dists_by_mode[mode["mode"]][ind]) for mode in modes}

    return raw_rests


def add_scores(restaurants, wt_loc, wt_rating, wt_price):
    scorer = Scorer(wt_loc, wt_rating, wt_price)
    scores = scorer.score_many(restaurants)
    return [ScoredRestaurant(score, **rest.__dict__) for score, rest in zip(scores, restaurants)]


if __name__ == "__main__":
    my_coords = "42.3511472", "-71.0476371"
    rests = get_restaurants(my_coords)
    import json
    print(json.dumps([r.__dict__ for r in rests], indent=2, sort_keys=True))
