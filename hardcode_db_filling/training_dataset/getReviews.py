import json
from deep_translator import GoogleTranslator


class Review:
    def __init__(self, text, rating, type):
        self.text = text
        self.rating = rating
        self.type = type
        
    def to_dict(self):
        return {
            "text": self.text,
            "rating": self.rating,
            "type": self.type
        }
        
    def translate(self):
        pass

# Шлях до Yelp business.json
input_file = "business.json"
output_file = "filtered_business_ids.json"

# Ключові слова для фільтрації (перекладено)
target_keywords = {
    "furniture", "electronics", "sports", "kiosk", "chemist", "pub", "townhall", "attraction",
    "supermarket", "bar", "fast food", "pharmacy", "alcohol", "convenience", "stationery", "library",
    "shoes", "clothes", "bakery", "mobile phone", "fuel", "memorial", "jewelry", "cafe", "butcher",
    "doctors", "hardware", "dentist", "hotel", "post office", "confectionery", "clinic",
    "atm", "hairdresser", "restaurant", "bank", "doityourself", "beauty", "store", "tourism",
    "landmark", "amenities"
}

# Приводимо ключові слова до нижнього регістру для порівняння
target_keywords = {k.lower() for k in target_keywords}

business_map = {}
# Зчитуємо JSON построково
with open("D:\Bin\Hackaton\Best2025\yelp_academic_dataset_business.json", "r", encoding="utf-8") as f:
    for line in f:
        if len(business_map) >= 6000:
            break

        business = json.loads(line)
        categories = business.get("categories")

        if categories:
            categories_set = {cat.strip().lower() for cat in categories.split(",")}

            matched_keyword = None
            for category in categories_set:
                for keyword in target_keywords:
                    if keyword in category:
                        matched_keyword = keyword
                        break
                if matched_keyword:
                    break

            if matched_keyword:
                business_map[business["business_id"]] = matched_keyword

matched_reviews = []
i = 1
with open("D:\Bin\Hackaton\Best2025\yelp_academic_dataset_review.json", "r", encoding="utf-8") as f:
    for line in f:
        review = json.loads(line)
        business_id = review.get("business_id")

        if business_id in business_map:
            review_obj = Review(
                text= GoogleTranslator(source='en', target='uk').translate(review.get("text", "")),
                rating=review.get("stars", 0),
                type=business_map[business_id]
            )
            matched_reviews.append(review_obj)
            i += 1
        if i % 200 == 0:
            with open("filtered_reviews.json", "a", encoding="utf-8") as f_out:
                for review in matched_reviews:
                    json.dump(review.to_dict(), f_out, ensure_ascii=False)
                    f_out.write("\n") 
            matched_reviews.clear()
            print("\n", i)
        if len(matched_reviews) >= 25000:  
            break


output_reviews = [r.to_dict() for r in matched_reviews]




