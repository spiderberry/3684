import db from './init-db.js';
import Athlete from './Athlete.js';
import AthleteSeason from './AthleteSeason.js';

class Repository {
    
    athletesFindById(id) {
        const row = db.prepare(
            'SELECT * FROM athletes WHERE id = ?'
        ).get(id);

        return row ? new Athlete(row) : null;
    }

    athletesFindByCountryId(countryId) {
        const rows = db.prepare(
            'SELECT * FROM athletes WHERE country_id = ?'
        ).all(countryId);

        return rows.map(row => new Athlete(row));
    }

    athletesGetAll() {
        const rows = db.prepare(
            'SELECT * FROM athletes'
        ).all();

        return rows.map(row => new Athlete(row));
    }

    countriesFindById(id) {
        return db.prepare(
            'SELECT * FROM countries WHERE id = ?'
        ).get(id);
    }

    athleteSeasonsFindByAthleteId(athleteId) {
        const rows = db.prepare(
            'SELECT * FROM athlete_seasons WHERE athlete_id = ?'
        ).all(athleteId);

        return rows.map(row => new AthleteSeason(row));
    }

    athleteSeasonsFindByAthleteIdAndYear(athleteId, year) {
        const row = db.prepare(
            'SELECT * FROM athlete_seasons WHERE athlete_id = ? AND year = ?'
        ).get(athleteId, year);

        return row ? new AthleteSeason(row) : null;
    }
}

export default new Repository();