# Calculates scores for restaurants
import math
from utils import dot_product


class Scorer:
    """
    Scores each batch of restaurants
    """
    MAX_SCORE = 10

    def __init__(self, wt_loc, wt_rating, wt_price):
        """ Constructs a scorer

        :param wt_loc: The importance of the location of the restaurant, float from 0 to 1
        :param wt_rating: The importance of the rating of the restaurant, float from 0 to 1
        :param wt_price: The importance of the price of the restaurant, float from 0 to 1
        """
        self.weights = [wt_loc, wt_rating, wt_price]

    def score_many(self, all_restaurants):
        """
        Calculates the overall scores of all the restaurants in the given list of them, out of 10

        :param all_restaurants: A list of objects representing restaurants
        :return: A list of floats 1-10 representing the overall scores of the given restaurants
        """
        avg_number_of_ratings = sum([r.num_ratings for r in all_restaurants]) / len(all_restaurants)
        all_scores = [self.score_one(r, avg_number_of_ratings) for r in all_restaurants]
        return all_scores

    def score_one(self, rest, avg_number_of_ratings):
        """
        Calculates the overall score for a single restaurant, out of 10
        :param rest: Obj representing the restaurant to calculate a score for
        :param avg_number_of_ratings: The average number of ratings received by restaurants in this
            batch
        :return: The overall score of the restaurant, out of 10
        """
        scores = [self.calc_location_score(rest),
                  self.calc_rating_score(rest, avg_number_of_ratings),
                  self.calc_price_score(rest)]
        print(f"Restaurant: {rest.name}\nRatings (score, num): {[rest.rating, rest.num_ratings]}\nScores (loc, rating, price): {scores}\n\n")
        final_score = dot_product(self.weights, scores) * self.MAX_SCORE / sum(self.weights)
        return final_score

    def calc_location_score(self, rest):
        """
        Calculates a 0-1 score based on the distance of the restaurant from the current location.

        :param rest:
        :return:
        """
        transit = "walking"
        dist = rest.travel_info[transit]['distance']
        # The function is concave-down and decreasing, and heavily penalizes restaurants more than
        # a mile or so away. Any restaurant more than 3 miles away will receive a score of 0.
        return max(-0.01 * dist ** 4 - 0.03 * dist ** 2 + 1, 0)

    def calc_rating_score(self, rest, avg_number_of_ratings):
        """
        # TODO: Parse reviews for sentiment
        Calculates a 0-1 score representative of the restaurant reviews, adjusted for how likely
        they are to be trustworthy.

        :param rest: An object representing a restaurant
        :param avg_number_of_ratings: The average number of ratings received by restaurants in this
            particular batch
        :return: A 0-1 score summarizing the reviews of the restaurant
        """
        # Normalize the star rating a 0-1 value
        normalized_avg_rating = (rest.rating - 1) / 4
        middle_rating = 0.5
        # Compare the number of ratings received by this restaurant to the average number of ratings
        # received by restaurants in this batch
        num_rating_ratio = rest.num_ratings / avg_number_of_ratings
        # Normalize this ratio so that restaurants don't benefit from any more than roughly twice
        # the average number of ratings
        normalized_num_review_ratio = math.tanh(math.sqrt(5 * num_rating_ratio))
        # Scale the delta from the middle ratio using the normalized num review ratio
        final_score = ((normalized_avg_rating - middle_rating) * normalized_num_review_ratio) + middle_rating
        return final_score

    def calc_price_score(self, rest):
        """
        Calculates a price score based on the number of $'s in the google price.
        # TODO: Consider manually picking out popular items from restaurants to get an "expected" price for a continuous score
        :param rest:
        :return:
        """
        price_score_dict = {1: 1, 2: 0.75, 3: 0.1, 4: 0}
        score = price_score_dict.get(rest.price_level)
        if score is None:
            raise ValueError(
                f"Invalid price level {rest.price_level}. Valid price levels are ints 1-4")
        return score
