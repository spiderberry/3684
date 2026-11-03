import requests
import json

competition_id = 6999193
event_id = 204593

url = f"https://worldathletics.nimarion.de/competitions/{competition_id}/results"

response = requests.get(
    url,
    params={"eventId": event_id},
    timeout=30,
)

response.raise_for_status()  # Raises an error for unsuccessful HTTP responses
data = response.json()      # Converts JSON into Python dictionaries/lists

athlete_dict = {}

for event in data["events"]:
    for race in event["races"]:
        print("Round:", race["race"])
        print("---------------------")

        for result in race["results"]:
            print("Country:", result["country"])
            print("Date:", result["date"])
            season = result["date"][0:4]

            for leg, athlete in enumerate(result["athletes"], start=1):
                print(
                    athlete["id"],
                    athlete["firstname"],
                    athlete["lastname"],
                )

                if athlete["id"] not in athlete_dict:
                    athlete_dict[athlete["id"]] = {
                        "first_name": athlete["firstname"],
                        "last_name": athlete["lastname"],
                        "seasons": {},
                    }

                if season not in athlete_dict[athlete["id"]]["seasons"]:
                    athlete_dict[athlete["id"]]["seasons"][season] = {
                        "country": result["country"],
                        "baseline_100m": None,
                        "relay_appearances": [],
                    }

                athlete_dict[athlete["id"]]["seasons"][season]["relay_appearances"].append({
                        "round": race["race"],
                        "date": result["date"],
                        "competition_id": competition_id,
                        "event_id": event["eventId"],
                        "race_id": race["raceId"],
                        "leg": leg
                    })
                    
            print("\n")

#print(f"Athlete Dictionary:\n{json.dumps(athlete_dict, indent=4)}")

# Fetch individual athlete results for each athlete in the dictionary

for athlete_id, athlete_info in athlete_dict.items():
    response = requests.get(
        f"https://worldathletics.nimarion.de/athletes/{athlete_id}/results",
        params={"year": list(athlete_info["seasons"])[0]},
        timeout=30,
    )
    response.raise_for_status()
    results = response.json()
    print(f"Results for {athlete_info['first_name']} {athlete_info['last_name']} (ID: {athlete_id}):")
    print(json.dumps(results, indent=4))


    # Filter  athlete's results and update athlete_info 