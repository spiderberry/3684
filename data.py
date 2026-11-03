# Collect Olympic relay athletes and their eligible 100m baselines.

import json
import math
from datetime import date, datetime, timezone
from pathlib import Path

import requests

BASE_URL = "https://worldathletics.nimarion.de"
COMPETITION_ID = 6999193
EVENT_ID = 204593
CUTOFF_DATE = "2012-08-09"


def save_raw_response(response, data, raw_results, output_path):
    # Keep all successful responses together, keyed by their full request URL.
    raw_results[response.url] = {
        "url": response.url,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "data": data,
    }
    # Save after each response so earlier downloads survive an interrupted run.
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = output_path.with_suffix(".tmp")
    with temporary_path.open("w", encoding="utf-8") as file:
        json.dump(raw_results, file, indent=2, ensure_ascii=False)
    temporary_path.replace(output_path)


def get_competition_results(competition_id, event_id, raw_results, output_path):
    response = requests.get(
        f"{BASE_URL}/competitions/{competition_id}/results",
        params={"eventId": event_id},
        timeout=30,
    )

    response.raise_for_status()
    data = response.json()
    save_raw_response(response, data, raw_results, output_path)
    return data


def get_athlete_results(athlete_id, raw_results, output_path, season=None):
    # Leave out season to request all years (also used for recovery)
    response = requests.get(
        f"{BASE_URL}/athletes/{athlete_id}/results",
        params={"year": season} if season is not None else {},
        timeout=30,
    )

    response.raise_for_status()
    data = response.json()
    save_raw_response(response, data, raw_results, output_path)
    return data


def get_season_results(athlete_id, season, raw_results, output_path):
    # Recover from a server error in a year-specific request
    try:
        return get_athlete_results(athlete_id, raw_results, output_path, season)
    
    except requests.HTTPError as error:
        if error.response is None or error.response.status_code < 500:
            raise
        print(f"Year request failed for {athlete_id}/{season}; trying all years.")

        # find_baseline filters the returned results to the requested season.
        return get_athlete_results(athlete_id, raw_results, output_path)


def build_athlete_dict(data, competition_id):
    athlete_dict = {}
    for event in data["events"]:
        for race in event["races"]:
            for result in race["results"]:
                season = result["date"][:4]

                # List is ordered by leg, but we want to store the leg number for each athlete.
                for leg, athlete in enumerate(result["athletes"], start=1):
                    athlete_id = athlete["id"]
                    if athlete_id not in athlete_dict:
                        athlete_dict[athlete_id] = {
                            "first_name": athlete["firstname"],
                            "last_name": athlete["lastname"],
                            "seasons": {},
                        }

                    seasons = athlete_dict[athlete_id]["seasons"]
                    if season not in seasons:
                        seasons[season] = {
                            "country": result["country"],
                            "baseline_100m": None,
                            "baseline_season": None,
                            "baseline_fallback": False,
                            "relay_appearances": [],
                        }

                    seasons[season]["relay_appearances"].append({
                        "round": race["race"],
                        "date": result["date"],
                        "competition_id": competition_id,
                        "event_id": event["eventId"],
                        "race_id": race["raceId"],
                        "leg": leg,
                    })
    return athlete_dict


def find_baseline(results, season, cutoff_date):
    # Return the fastest eligible time, or None when none qualify
    cutoff = date.fromisoformat(cutoff_date)
    best = None
    for performance in results:
        if performance.get("disciplineCode") != "100":
            continue
        if performance.get("location", {}).get("indoor") is not False:
            continue
        if performance.get("legal") is not True:
            continue
        try:
            performed_on = date.fromisoformat(performance["date"][:10])
            time = float(performance["mark"])
        except (KeyError, TypeError, ValueError):
            continue
        if performed_on.year != int(season) or performed_on > cutoff:
            continue
        if math.isfinite(time) and time > 0 and (best is None or time < best):
            best = time
    return best


def fill_baselines(athlete_dict, cutoff_date, raw_results, output_path):
    # Try the card season, then the previous year only if no result qualifies.
    # cutoff_date applies to this competition batch. 
    # Use a separate call/config for another Olympics. Previous-year fallback considers that whole year.
    
    failed_requests = []
    for athlete_id, athlete_info in athlete_dict.items():
        for season, season_info in athlete_info["seasons"].items():
            if int(season) != date.fromisoformat(cutoff_date).year:
                raise ValueError(f"Provide a matching cutoff for season {season}")
            requested_season = season
            try:
                results = get_season_results(athlete_id, requested_season, raw_results, output_path)
                baseline = find_baseline(results, requested_season, cutoff_date)

                # Check AFTER all target-year performances, not per performance.
                if baseline is None:
                    requested_season = str(int(season) - 1)
                    results = get_season_results(athlete_id, requested_season, raw_results, output_path)
                    baseline = find_baseline(
                        results, requested_season, f"{requested_season}-12-31"
                    )
            except (requests.RequestException, ValueError) as error:
                failed_requests.append({
                    "athlete_id": athlete_id,
                    "card_season": season,
                    "requested_season": requested_season,
                    "error": str(error),
                })
                print(f"Failed: {athlete_id}/{requested_season}: {error}")
                continue

            season_info["baseline_100m"] = baseline
            season_info["baseline_season"] = requested_season if baseline is not None else None
            season_info["baseline_fallback"] = baseline is not None and requested_season != season
            name = f"{athlete_info['first_name']} {athlete_info['last_name']}"
            print(f"{name} ({season}): {baseline} [source season: {season_info['baseline_season']}]")
    return failed_requests


def main():
    output_path = Path(__file__).resolve().parent / "raw" / f"raw_results_{CUTOFF_DATE[:4]}.json"
    # Retain responses already saved by a previous run.
    if output_path.exists():
        with output_path.open(encoding="utf-8") as file:
            raw_results = json.load(file)
    else:
        raw_results = {}

    data = get_competition_results(COMPETITION_ID, EVENT_ID, raw_results, output_path)
    athlete_dict = build_athlete_dict(data, COMPETITION_ID)
    failed_requests = fill_baselines(athlete_dict, CUTOFF_DATE, raw_results, output_path)
    print(json.dumps(athlete_dict, indent=4))

    if failed_requests:
        print("Unresolved requests (not evidence of missing performances):")
        print(json.dumps(failed_requests, indent=4))
    return athlete_dict, failed_requests


if __name__ == "__main__":
    main()