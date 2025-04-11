import json
import psycopg2
from dbConection import dbConnection

class Place:
    def __init__(self, name: str, description: str, lat: float, lon: float, type: str, subtype: str, rating: float,
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
        
class HighWay:
    def __init__(self, lat:float, lon:float, type: str,
                 hasTactilePaving: bool, hasSoundSignaling: bool, inclusivity: int):
        self.lat = lat
        self.lon = lon
        self.type = type
        self.hasTactilePaving = hasTactilePaving
        self.hasSoundSignaling = hasSoundSignaling
        self.inclusivity = inclusivity


def connect_to_db():
    try:
        connection = psycopg2.connect(
            host=dbConnection.host,
            port=dbConnection.port,
            dbname=dbConnection.dbname,
            user=dbConnection.user,
            password=dbConnection.password
        )
        return connection
    except Exception as e:
        print(f"Помилка при підключенні: {e}")
        return None


def save_place_to_db(place, cursor):
    insert_query = """
        INSERT INTO places_tbl (name, description, lat, lon, type, subtype, rating, 
                            has_ramp, has_tactile_paving, has_adaptive_toilet, has_elevator, 
                            on_first_floor, inclusivity)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    cursor.execute(insert_query, (
        place.name, place.description, place.lat, place.lon, place.type, place.subtype, place.rating,
        place.hasRamp, place.hasTactilePaving, place.hasAdaptiveToilet, place.hasElevator,
        place.onFirstttFloor, place.inclusivity
    ))
    
def save_crosing_to_db(place, cursor):
    insert_query = """
        INSERT INTO crossings_tbl (lat, lon, type, has_sound_signals, 
                            has_tactile_paving, inclusivity)
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    cursor.execute(insert_query, ( place.lat, place.lon, place.type,place.hasSoundSignaling ,place.hasTactilePaving , place.inclusivity))


def process_json_and_save(file_path):
    try:

        with open("D:\Bin\Hackaton\Best2025\TestProject\data.json", 'r', encoding='utf-8') as file:
            data = json.load(file)


        connection = connect_to_db()
        if connection is None:
            return
        
        cursor = connection.cursor()


        i = 1
        for item in data:
            place = Place(
                name=item['name'],
                description=item['description'],
                lat=item['lat'],
                lon=item['lon'],
                type=item['type'],
                subtype=item['subtype'],
                rating=item['rating'],
                hasRamp=item['hasRamp'],
                hasTactilePaving=item['hasTactilePaving'],
                hasAdaptiveToilet=item['hasAdaptiveToilet'],
                hasElevator=item['hasElevator'],
                onFirstttFloor=item['onFirstttFloor'],
                inclusivity=item['inclusivity']
            )
            if place.lat != -999: 
                save_place_to_db(place, cursor)
                i = i + 1
                
            if i %1000 == 0:
                connection.commit()
                print("\n", i)
            if i == 3000:
                break
                
        # with open("D:\Bin\Hackaton\Best2025\TestProject\crossings.json", 'r', encoding='utf-8') as fCrossings:
        #     crossings = json.load(fCrossings)
            
        # i = 1
        # for item in crossings:
        #     place = HighWay(
        #         lat=item['lat'],
        #         lon=item['lon'],
        #         type=item['type'],
        #         hasTactilePaving=item['hasTactilePaving'],
        #         hasSoundSignaling=item['hasSoundSignaling'],
        #         inclusivity=item['inclusivity']
        #     )
        #     save_crosing_to_db(place, cursor)
        #     i = i + 1
        #     if i %1000 == 0:
        #         connection.commit()
        #         print("\n", i)
        #     if i == 1500:
        #         connection.commit()
        #         break
            
        
        connection.commit()

       
        cursor.close()
        connection.close()

        print("Об'єкти успішно збережені в базі даних.")

    except Exception as e:
        print(f"Помилка при обробці JSON файлу або збереженні: {e}")


process_json_and_save('D:\Bin\Hackaton\Best2025\TestProject\data.json')  
