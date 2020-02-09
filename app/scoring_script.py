import json

from models import Restaurant
from controllers.restaurant_service import add_scores

if __name__ == "__main__":
    with open("asian_data.json", "r") as f:
        restaurants = json.load(f)
    # restaurants = [fix_photo_refs_rest_dict(r) for r in restaurants]
    restaurants = [Restaurant(**r) for r in restaurants]

    wt_loc = wt_rating = wt_price = 1
    scored_restaurants = add_scores(restaurants, wt_loc, wt_rating, wt_price)
    scored_restaurants.sort(key=lambda sr: sr.score, reverse=True)
    print(json.dumps([sr.__dict__ for sr in scored_restaurants[:5]], sort_keys=True, indent=2))
