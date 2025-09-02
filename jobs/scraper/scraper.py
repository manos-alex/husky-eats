from bs4 import BeautifulSoup
import requests

def main():
    html = requests.get("https://nutritionanalysis.dds.uconn.edu/longmenu.aspx?sName=UCONN+Dining+Services&locationNum=05&locationName=North+Campus+Dining+Hall&naFlag=&WeeksMenus=This+Week%27s+Menus&dtdate=09%2f01%2f2025&mealName=Lunch")
    soup = BeautifulSoup(html.text, "html.parser")

    items = soup.find_all('div', attrs={'class' : 'longmenucoldispname'})
    for item in items:
        print(item.text)

main()
