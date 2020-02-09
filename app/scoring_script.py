import json

from controllers.restaurant_service import restaurants_with_scores
from models.models import Restaurant

if __name__ == "__main__":
    with open("asian_data.json", "r") as f:
        restaurants = json.load(f)
    # restaurants = [fix_photo_refs_rest_dict(r) for r in restaurants]
    restaurants = [Restaurant(**r) for r in restaurants]

    wt_loc = 1
    wt_price = 1
    wt_rating = 1
    scored_restaurants = restaurants_with_scores(restaurants, wt_loc, wt_rating, wt_price)
    print(json.dumps([(score, rest.name) for score, rest in scored_restaurants[:5]], sort_keys=True, indent=2))
