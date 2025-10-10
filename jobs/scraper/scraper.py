from bs4 import BeautifulSoup
import requests
import re
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()   # Read .env in the current directory

### MENU ITEMS ###
def scrapeMenu(hall_id='01', date=datetime.today(), mealtime='Lunch'):
    """Scrape dining hall menu by meal and date"""

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
    id_servsize = {}    # Store ids and serving sizes to scrape nutrition facts
    for s in soup.find_all(attrs={"name": "recipe"}):
        item_value = s["value"].split("*")
        item_ids[s.parent.text] = int(item_value[0])
        id_servsize[item_value[0]] = item_value[1]

    # Make objects for each menu item
    menuitem_data = []
    station = ""

    for item in text:
        # Check if string is a station or menu item
        if item[0] == '-':
            # Reformat station string
            cleaned = item.strip(' -')
            station = " ".join(word.capitalize() for word in cleaned.split())
        else:
            menuitem_data.append({
                "id": item_ids[item],
                "name": item,
                "meal": mealtime,
                "hallid": int(hall_id),
                "date": date.strftime("%Y-%m-%d"),
                "station": station
            })
    
    # Scrape nutrition info
    nutritionfacts_data = scrapeNutrition(id_servsize)

    return menuitem_data, nutritionfacts_data


### NUTRITION FACTS ###
def scrapeNutrition(to_scrape={}):
    """Scrape nutrition facts of inputted item ids and serving sizes"""

    data = []

    for id in to_scrape:
        html = requests.get(f"https://nutritionanalysis.dds.uconn.edu/label.aspx?locationNum=01&RecNumAndPort={id}*{to_scrape[id]}")
        soup = BeautifulSoup(html.text, "html.parser")

        # Initialize nutrition facts
        nutrition_facts = {
            "name": soup.find(class_="labelrecipe").get_text(),
            "vegan": None,
            "vegetarian": None,
            "glutenfriendly": None,
            "smartcheck": None,
            "lesssodium": None,
            "nogarliconion": None,
            "containsnuts": None,
            "servingsize": "N/A",
            "calories": None,
            "totalfat": "N/A",
            "saturatedfat": "N/A",
            "transfat": "N/A",
            "cholesterol": "N/A",
            "sodium": "N/A",
            "calcium": "N/A",
            "iron": "N/A",
            "totalcarbohydrate": "N/A",
            "dietaryfiber": "N/A",
            "totalsugars": "N/A",
            "addedsugars": "N/A",
            "protein": "N/A",
            "vitamind": "N/A",
            "potassium": "N/A",
            "allergens": "N/A",
        }

        # Check if information is available
        if soup.find(class_="labelnotavailable"):
            # Terminate early 
            data.append(nutrition_facts)
            continue

        # Find and loop through nutrients
        nutr_keys = ["totalfat", "totalcarbohydrate", "saturatedfat", "dietaryfiber", "transfat", "totalsugars", "cholesterol", "addedsugars", "sodium", "protein", "calcium", "iron", "vitamind", "potassium"]
        nutr_values = []
        nutfactstopnutrient = soup.find_all(class_="nutfactstopnutrient")
        for nutrient in nutfactstopnutrient:
            text = nutrient.get_text(" ", strip=True)

            text = text.replace("\xa0", " ")
            if "- - -" in text: 
                nutr_values.append("N/A")
            else:
                match = re.search(r"(\d+\.?\d*)(g|mg|mcg)", text, re.IGNORECASE)
                if match:
                    nutr_values.append(match.group())
        # Pair nutrient key and values
        nutrition_facts.update(dict(zip(nutr_keys, nutr_values)))
        
        # Find tags; GF, nuts, vegan, etc.
        tags = soup.find(class_="labelwebcodesvalue")
        if tags:
            nutrition_facts["glutenfriendly"] = bool(tags.find(attrs={"src": "LegendImages/glutenfree.gif"}))
            nutrition_facts["vegan"] = bool(tags.find(attrs={"src": "LegendImages/vegan.gif"}))
            nutrition_facts["vegetarian"] = bool(tags.find(attrs={"src": "LegendImages/vegetarian.gif"}))
            nutrition_facts["lesssodium"] = bool(tags.find(attrs={"src": "LegendImages/sodium.gif"}))
            nutrition_facts["nogarliconion"] = bool(tags.find(attrs={"src": "LegendImages/nogarlicandonions.gif"}))
            nutrition_facts["containsnuts"] = bool(tags.find(attrs={"src": "LegendImages/nuts.gif"}))
        else:
            nutrition_facts["glutenfriendly"] = False
            nutrition_facts["vegan"] = False
            nutrition_facts["vegetarian"] = False
            nutrition_facts["lesssodium"] = False
            nutrition_facts["nogarliconion"] = False
            nutrition_facts["containsnuts"] = False
        nutrition_facts["smartcheck"] = False

        # Find metadata
        nutrition_facts["servingsize"] = soup.find(class_="nutfactsservsize", string=lambda t: t and not t.startswith("S")).get_text()
        nutrition_facts["calories"] = int(soup.find(class_="nutfactscaloriesval").get_text())
        nutrition_facts["allergens"] = soup.find(class_="labelallergensvalue").get_text()

        data.append(nutrition_facts)

    return data
        
def push_menuitems(hall_id, mealtime, date=datetime.today()):
    """Post menu items and nutrition facts to database"""

    API_KEY = os.getenv("API_KEY")

    MENUITEM_API_URL = "https://huskyeats.loca.lt/api/menuitem"
    NUTRITIONFACT_API_URL = "https://huskyeats.loca.lt/api/nutrition"

    headers = {"x-api-key": API_KEY}

    menuitems, nutritionfacts = scrapeMenu(hall_id=hall_id, date=date, mealtime=mealtime)
    # Post menu items
    r = requests.post(MENUITEM_API_URL, headers=headers, json=menuitems)
    r.raise_for_status()
    # Post nutrition facts
    r = requests.post(NUTRITIONFACT_API_URL, headers=headers, json=nutritionfacts)
    r.raise_for_status()

    print("Response:", r.json(), "for", hall_id, mealtime)
