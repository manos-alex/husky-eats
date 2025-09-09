from bs4 import BeautifulSoup
import requests
from datetime import datetime

today = datetime.today().strftime("%m%%2f%d%%2f%Y")

def scrapeMenu(hall_id='05', date=today, mealtime='Lunch'):
    html = requests.get(f"https://nutritionanalysis.dds.uconn.edu/longmenu.aspx?&locationNum={hall_id}&dtdate={date}&mealName={mealtime}")
    soup = BeautifulSoup(html.text, "html.parser")

    items = soup.find_all('div', attrs={'class' : 'longmenucoldispname'})
    for item in items:
        print(item.text)

scrapeMenu(hall_id='16')
