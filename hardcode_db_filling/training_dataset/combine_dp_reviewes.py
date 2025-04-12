import json
from collections import defaultdict
import random

class trainUnit:
    
    def __init__(self, type, id, text, rating, inclusivity):
        self.type = type
        self.id = id
        self.text = text
        self.rating = rating
        self.inclusivity = inclusivity
        
    def to_dict(self):
        return {
            "id" : self.id,
            "text": self.text,
            "inclusivity" : self.inclusivity,
            "rating": self.rating,
            "subtype": self.type,
            "description" : ""
        }

# Мапа перекладів subtype з української на англійську
ua_to_en = {
    "Супермаркет": "supermarket",
    "Фаст-фуд": "fast food",
    "Аптека": "pharmacy",
    "Кафе": "cafe",
    "Готель": "hotel",
    "Відділення пошти": "post office",
    "Ресторан": "restaurant",
    "Банк": "bank",
    "Алкоголь": "alcohol",
    "Зручний магазин": "convenience",
    "Пам'ятник": "memorial",
    "Ювелірний": "jewelry",
    "Мобільний телефон": "mobile phone",
    "Взуття": "shoes",
    "Одяг": "clothes",
    "Пекарня": "bakery",
    "М'ясник": "butcher",
    "Лікарі": "doctors",
    "Стоматолог": "dentist",
    "Клініка": "clinic",
    "Перукарня": "hairdresser",
    "Краса": "beauty",
    "Аптека": "pharmacy",
    "Обладнання": "hardware",
    "Пошта": "post office",
    "Станція": "fuel",  
    "Автомат": "atm"
}


with open("D:\Bin\Hackaton\Best2025\db.json", "r", encoding="utf-8") as f:
    data = json.load(f)

ids = defaultdict(list)
incScore = {}

for item in data:
    subtype = item.get("subtype")
    id_ = item.get("id")  


    subtype_eng = ua_to_en.get(subtype, subtype.lower()) 

    ids[subtype_eng].append(id_)
    incScore[id_] = item.get("inclusivity")


with open("D:\Bin\Hackaton\Best2025\gitTestProject\Hackathon_2025\\filtered_reviews.json", "r", encoding="utf-8") as f:
    reviews = json.load(f)

units = []
for review in reviews:
    subtype = review.get('type')  # оголошуєш тут
    if subtype not in ['store', 'mobile phone', 'landmark']: 
        id = random.choice(ids[subtype])

        unit = trainUnit(
            type=subtype,
            text=review.get("text"),
            id= id, 
            inclusivity=incScore.get(id),
            rating=review.get("rating")
        )
        units.append(unit)


units_dict = [unit.to_dict() for unit in units]

with open("trainDataSet.json", 'w', encoding='utf-8') as file:
        json.dump(units_dict, file, ensure_ascii=False, indent=4) 