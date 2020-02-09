from controllers import restaurant_service
import json


if __name__ == '__main__':
    my_coords = "42.3511472", "-71.0476371"
    food_types = ('asian', 'burger', 'pizza', 'mexican')
    for ft in food_types:
        rests = restaurant_service.get_restaurants(my_coords, radius=10000, keyword=ft, maxprice=4, count=60)
        result = [r.__dict__ for r in rests]
        with open(f"{ft}_data.json", 'w+') as f:
            json.dump(result, f, indent=2, sort_keys=True)