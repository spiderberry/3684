from bs4 import BeautifulSoup
import requests

URL = "https://worldathletics.org/competition/calendar-results/results/6999193?eventId=204593&gender=M"
page = requests.get(URL)

soup = BeautifulSoup(page.content, "html.parser")

results = soup.find_all("section", class_="EventResults_eventResult__3oyX4")

tables = results[0].find_all("table", class_="styles_table__yjrQa")

for table in tables:
    round = table.parent.parent.parent.find("span", class_="EventResults_eventMeta__75ELD")
    print(round.get_text())
    print("\n")

    rows = table.find_all("td", class_="EventResults_name__3UzJp")

    for row in rows:
        athlete = row.find_all("a")
        for a in athlete:
            print(a.get_text())
            print(f"https://worldathletics.org{a['href']}")
            print("--------------------")
            print("\n")

    print("\n")
