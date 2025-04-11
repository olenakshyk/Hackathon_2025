import requests
import json
from typing import List
import sys
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

class Place:
    def __init__(self, name: str, description: str,lat:float, lon:float, type: str, subtype: str, rating: float,
                 hasRamp: bool, hasTactilePaving: bool, hasAdaptiveToilet: bool, hasElevator: bool,
                 onFirstttFloor: bool, inclusivity: int): 
        self.name = name
        self.description = description
        self.lat = lat
        self.lon = lon
        self.type = type
        self.subtype = subtype
        self.rating = rating
        self.hasRamp = hasRamp
        self.hasTactilePaving = hasTactilePaving
        self.hasAdaptiveToilet = hasAdaptiveToilet
        self.hasElevator = hasElevator
        self.onFirstttFloor = onFirstttFloor
        self.inclusivity = inclusivity
        
    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "lat" : self.lat,
            "lon" : self.lon,
            "type": self.type,
            "subtype": self.subtype,
            "rating": self.rating,
            "hasRamp": self.hasRamp,
            "hasTactilePaving": self.hasTactilePaving,
            "hasAdaptiveToilet": self.hasAdaptiveToilet,
            "hasElevator": self.hasElevator,
            "onFirstttFloor": self.onFirstttFloor,
            "inclusivity": self.inclusivity
        }
    
class HighWay:
    def __init__(self, lat:float, lon:float, type: str,
                 hasTactilePaving: bool, hasSoundSignaling: bool, inclusivity: int):
        self.lat = lat
        self.lon = lon
        self.type = type
        self.hasTactilePaving = hasTactilePaving
        self.hasSoundSignaling = hasSoundSignaling
        self.inclusivity = inclusivity
        
    def to_dict(self):
        return {
            "lat" : self.lat,
            "lon" : self.lon,
            "type": self.type,
            "hasTactilePaving": self.hasTactilePaving,
            "hasSoundSignaling" : self.hasSoundSignaling,
            "inclusivity": self.inclusivity
        }
  
def save_place_to_json(place: Place, filename: str):
    places_dict = [place.to_dict() for place in places if place.name != "Без назви" or place.type != "Невідмо"]
      
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(places_dict, file, ensure_ascii=False, indent=4)   
        
def save_highway_to_json(crossings, filename: str):
    crossings_dict = [crossing.to_dict() for crossing in crossings if crossing.type != "Невідмо"]
      
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(crossings_dict, file, ensure_ascii=False, indent=4) 

query = """
[out:json][timeout:180];
area["name"="Україна"]["boundary"="administrative"]["admin_level"="2"]->.searchArea;
(
  node["wheelchair"="yes"](area.searchArea);
  way["wheelchair"="yes"](area.searchArea);
  relation["wheelchair"="yes"](area.searchArea);

  node["tactile_paving"="yes"](area.searchArea);
  way["tactile_paving"="yes"](area.searchArea);
  relation["tactile_paving"="yes"](area.searchArea);

  node["toilets:wheelchair"="yes"](area.searchArea);
  way["toilets:wheelchair"="yes"](area.searchArea);
  relation["toilets:wheelchair"="yes"](area.searchArea);
  
  node["elevator"="yes"](area.searchArea);
  way["elevator"="yes"](area.searchArea);
  relation["elevator"="yes"](area.searchArea);
  
  node["level"="0"](area.searchArea);
  way["level"="0"](area.searchArea);
  relation["level"="0"](area.searchArea);
);
out body;
"""

url = "https://overpass-api.de/api/interpreter"
response = requests.post(url, data={'data': query})

if response.status_code == 200:
  
    data = response.json()
    type_translation = {
          "crossing":"Перехід",
          "traffic_signals":"Світлофор",
          "fast_food":"Фаст-фуд",
          "post_office":"Відділення пошти",
          "amenity": "Зручності",
          "shop" : "Магазин",
          "tourism": "Туризм",
          "leisure":"Дозвілля",
          "highway":"Дорога",
          "historic": "Пам'ятка",
          "building": "Будівля",
          "restaurant": "Ресторан",
          "cafe": "Кафе",
          "school": "Школа",
          "hospital": "Лікарня",
          "supermarket": "Супермаркет",
          "bank": "Банк",
          "museum": "Музей",
          "hotel": "Готель",
          "pharmacy": "Аптека",
          "park": "Парк",
          "university": "Університет",
          "cinema": "Кінотеатр",
          "bus_stop": "Автобусна зупинка",
          "None" : "невідомо"
      }
    filename = "D:\Bin\Hackaton\Best2025\TestProject\data.json"
    places = []
    crossings = []
    #print(json.dumps(data, indent=2))
    for element in data["elements"]:
      tags = element.get("tags", {})

      name = tags.get("name", "Без назви")
      lat = element["lat"] if "lat" in element else -999
      lon = element['lon'] if "lon" in element else -999
      
      category = tags.get("amenity") or tags.get("shop") or tags.get("building") \
          or tags.get("tourism") or tags.get("leisure") or tags.get("historic") \
          or tags.get("highway") or "Невідомо"

      
      

      translated_type = type_translation.get(next((key for key in ["amenity", "shop", "building", "tourism", "leisure", "historic", "highway"] if key in tags), "None"))
      translated_subtype = type_translation.get(category, category.capitalize())
      
      has_ramp = tags.get("wheelchair") == "yes"
      has_tactile = tags.get("tactile_paving") == "yes"
      has_toilet = tags.get("toilets:wheelchair") == "yes"
      has_elevator = tags.get("elevator") == "yes"
      on_ground = tags.get("level") == "0"
      hasSoundSignaling = tags.get("traffic_signals:sound") == "yes"


      inclusivity_score = sum([(has_ramp if not translated_type == "Дорога" else 0), (has_tactile if translated_type == "Дорога" or translated_subtype in ["Парк", "Автобусна зупинка"] else 1), (has_toilet if translated_type != "Дорога" else 0), (on_ground if not has_elevator or translated_type != "Дорога" else 0)])

      if translated_type== "Дорога":
            crossing = HighWay(
                lat = lat,
                lon = lon,
                type=translated_subtype,
                hasTactilePaving=has_tactile,
                hasSoundSignaling = hasSoundSignaling,
                inclusivity=inclusivity_score
            )
            crossings.append(crossing)
      else:
            place = Place(
                name=name,
                description=f"{translated_type}",
                lat = lat,
                lon = lon,
                type=translated_type,
                subtype=translated_subtype,
                rating=0.0,  
                hasRamp=has_ramp,
                hasTactilePaving=has_tactile,
                hasAdaptiveToilet=has_toilet,
                hasElevator=has_elevator,
                onFirstttFloor=on_ground,
                inclusivity=inclusivity_score
            )
            places.append(place)
      # print(f"{name} ({category})")
      # print(f"ID: {element['id']}")
      # if 'wheelchair' in element['tags']:
      #   print("Пандус присутній")
      # if 'tactile_paving' in element['tags']:
      #   print("Тактильні елементи присутні")
      # if 'toilets:wheelchair' in element['tags']:
      #   print("Адаптований туалет присутній")
      # if 'elevator' in element['tags']:
      #   print('Присутніій ліфт')
      # if 'tags' in element and element['tags'].get('level') == "0":
      #       print(f"Об'єкт на рівні з землею: {element}")
        
      # print("\n")
        
    save_place_to_json(places, filename)
    save_highway_to_json(crossings, "D:\Bin\Hackaton\Best2025\TestProject\crossings.json")
else:
    print("Помилка:", response.status_code)