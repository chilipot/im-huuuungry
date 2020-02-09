import os
import time

from models.models import Restaurant
from controllers.score_service import Scorer
from utils import make_request
from utils import meters_to_miles

NEARBY_PLACE_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
DISTANCE_MATRIX_API_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"
PLACE_PICTURE_API_URL = "https://maps.googleapis.com/maps/api/place/photo"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
RESTAURANT_TYPE = "restaurant"


def get_restaurants(coords, radius=None, maxprice=3, keyword=None, count=60):
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


def get_restaurant_pic(photo_ref, max_width=400, max_height=400):
    params = {
        "key": GOOGLE_API_KEY,
        "photoreference": photo_ref,
        "maxwidth": max_width,
        "maxheight": max_height
    }
    resp = make_request(PLACE_PICTURE_API_URL, params=params, as_json=False)
    return resp


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


def scored_restaurant_ids(restaurants, wt_loc, wt_rating, wt_price):
    scorer = Scorer(wt_loc, wt_rating, wt_price)
    scores = scorer.score_many(restaurants)
    zip_list = [(score, rest.place_id) for score, rest in zip(scores, restaurants)]
    return [place_id for score, place_id in sorted(zip_list, key=lambda tup: tup[0], reverse=True)]


def restaurants_by_id(restaurants):
    return {r.place_id: r for r in restaurants}