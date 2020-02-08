import os

from models import Restaurant
from utils import make_request

NEARBY_PLACE_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
DISTANCE_MATRIX_API_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
RESTAURANT_TYPE = "restaurant"


def get_restaurants(coords, radius=None, maxprice=2, keyword=None, count=20):
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

    raw_restaurants = add_travel_info(raw_restaurants, coords)

    return [Restaurant.from_api_resp(raw_rest) for raw_rest in raw_restaurants]


def add_travel_info(raw_rests, coords):
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
                "distance": travel_info_obj["distance"]["value"]}

    for ind, rest in enumerate(raw_rests):
        rest["travel_info"] = {mode["mode"]: parse_travel_info(dists_by_mode[mode["mode"]][ind]) for mode in modes}

    return raw_rests


if __name__ == "__main__":
    my_coords = "42.3511472", "-71.0476371"
    rests = get_restaurants(my_coords)
    import json
    print(json.dumps([r.__dict__ for r in rests], indent=2, sort_keys=True))
