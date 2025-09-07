from bs4 import BeautifulSoup
import requests

def main():
    html = requests.get("https://nutritionanalysis.dds.uconn.edu/longmenu.aspx?&locationNum=05&dtdate=09%2f06%2f2025&mealName=Dinner")
    soup = BeautifulSoup(html.text, "html.parser")

    items = soup.find_all('div', attrs={'class' : 'longmenucoldispname'})
    for item in items:
        print(item.text)

main()
