class Restaurant:
    def __init__(self, rating, num_ratings, price_level, name, place_id, lat, lng, _photo_refs, travel_info):
        self.rating = rating
        self.num_ratings = num_ratings
        self.price_level = price_level
        self.name = name
        self.place_id = place_id
        self.lat = lat
        self.lng = lng
        self.travel_info = travel_info
        self._photo_refs = _photo_refs

    @staticmethod
    def from_api_resp(resp):
        props = {
            "rating": resp["rating"],
            "num_ratings": resp["user_ratings_total"],
            "price_level": resp["price_level"],
            "name": resp["name"],
            "place_id": resp["place_id"],
            "lat": resp["geometry"]["location"]["lat"],
            "lng": resp["geometry"]["location"]["lng"],
            "photo_refs": [photo["photo_reference"] for photo in resp.get("photos", [])],
            "travel_info": resp["travel_info"]
        }
        return Restaurant(**props)


    @property
    def photos(self):
        raise NotImplementedError()

    @property
    def coords(self):
        return self.lat, self.lng


class ScoredRestaurant(Restaurant):
    def __init__(self, score, **kwargs):
        super().__init__(**kwargs)
        self.score = score




