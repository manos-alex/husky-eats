from bs4 import BeautifulSoup
import requests
from datetime import datetime

def scrapeMenu(hall_id='05', date=datetime.today(), mealtime='Lunch'):
    html = requests.get(f"https://nutritionanalysis.dds.uconn.edu/longmenu.aspx?&locationNum={hall_id}&dtdate={date.strftime('%m%%2f%d%%2f%Y')}&mealName={mealtime}")
    soup = BeautifulSoup(html.text, "html.parser")

    # Find all stations and menu items
    text = [
        s.get_text(strip=True)
        for s in soup.find_all(class_=["longmenucolmenucat", "longmenucoldispname"])
        if s.get_text(strip=True)
    ]

    # Find all menu item ids
    item_ids = {}
    for s in soup.find_all(attrs={"name": "recipe"}):
        item_ids[s.parent.text] = int(s["value"].partition("*")[0])

    # Make objects for each menu item
    data = []
    station = ""

    for item in text:
        # Check if string is a station or menu item
        if item[0] == '-':
            # Reformat station string
            cleaned = item.strip(' -')
            station = " ".join(word.capitalize() for word in cleaned.split())
        else:
            data.append({"id": item_ids[item], "name": item, "meal": mealtime, "hallid": int(hall_id), "date": date.strftime("%Y-%m-%d"), "station": station})

    return data

def push_menuitems():
    API_URL = "https://huskyeats.loca.lt/api/ingest/menuitems"

    menuitems = scrapeMenu(hall_id='05', mealtime="Dinner")
    r = requests.post(API_URL, json=menuitems, timeout=10)
    r.raise_for_status()

    print("Response:", r.json())

if __name__ == "__main__":
    push_menuitems()