import requests
from scraper import push_menuitems

if __name__ == "__main__":
    res = requests.get("https://husky-eats.onrender.com/api/dininghall?")
    hall_data = res.json()

    halls = [f"{hall['id']:02}" for hall in hall_data]
    mealtimes = ["Breakfast", "Lunch", "Dinner"]

    for hall_id in halls:
        for mealtime in mealtimes:
            push_menuitems(hall_id, mealtime)
