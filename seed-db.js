const db = require('./init-db');

const insertCountry = db.prepare(`INSERT INTO countries (country, country_code) VALUES (?, ?)`);

const insertAthlete = db.prepare(`
  INSERT INTO athletes (first_name, last_name, gender, country_id)
  VALUES (?, ?, ?, ?)
`);

const insertAthleteSeason = db.prepare(`
  INSERT INTO athlete_seasons (athlete_id, year, sb_60m, sb_100m, sb_200m, sb_400m)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertTeam = db.prepare(`INSERT INTO teams (country_id, event, gender) VALUES (?, ?, ?)`);

const insertTeamPerformance = db.prepare(`
  INSERT INTO team_performance (team_id, year, round, result, status) 
  VALUES (?, ?, ?, ?, ?)`
);

const insertTeamAthlete = db.prepare(`INSERT INTO team_athletes (team_id, team_performance_id, athlete_id, leg) VALUES (?, ?, ?, ?)`);

const insertManyCountries = db.transaction((countries) => {
    for (const country of countries) {
        insertCountry.run(country.country, country.countryCode);
    }
});

const insertManyAthletes = db.transaction((athletes) => {
    for (const athlete of athletes) {
        insertAthlete.run(
            athlete.firstName,
            athlete.lastName,
            athlete.gender,
            athlete.countryId
        );
    }
});

const insertManyAthleteSeasons = db.transaction((athleteSeasons) => {
    for (const as of athleteSeasons) {
        insertAthleteSeason.run(
            as.athleteId,
            as.year,
            as.sb60m,
            as.sb100m,
            as.sb200m,
            as.sb400m
        );
    }
});

const insertManyTeams = db.transaction((teams) => {
    for (const team of teams) {
        insertTeam.run(
            team.countryId,
            team.event,
            team.gender
        );
    }
});

const insertManyTeamPerformances = db.transaction((teamPerformances) => {
    for (const tp of teamPerformances) {
        insertTeamPerformance.run(
            tp.teamId,
            tp.year,
            tp.round,
            tp.result,
            tp.status
        );
    }
});

const insertManyTeamAthletes = db.transaction((teamAthletes) => {
    for (const ta of teamAthletes) {
        insertTeamAthlete.run(
            ta.teamId,
            ta.teamPerformanceId,
            ta.athleteId,
            ta.leg
        );
    }
});

const countries = [
    { country: 'United States', countryCode: 'USA' },
    { country: 'Jamaica', countryCode: 'JAM' },
    { country: 'Great Britain', countryCode: 'GBR' },
    { country: 'Canada', countryCode: 'CAN' },
    { country: 'Australia', countryCode: 'AUS' }
];

const athletes = [
    {
        firstName: 'Christian',
        lastName: 'Coleman',
        gender: 'M',
        countryId: 1
    },
    {
        firstName: 'Fred',
        lastName: 'Kerley',
        gender: 'M',
        countryId: 1
    },
    {
        firstName: 'Kyree',
        lastName: 'King',
        gender: 'M',
        countryId: 1
    },
    {
        firstName: 'Courtney',
        lastName: 'Lindsey',
        gender: 'M',
        countryId: 1
    },
    {
        firstName: 'Kenneth',
        lastName: 'Bednarek',
        gender: 'M',
        countryId: 1
    },
    {
        firstName: 'Ackeem',
        lastName: 'Blake',
        gender: 'M',
        countryId: 2
    },
    {
        firstName: 'Jelani',
        lastName: 'Walker',
        gender: 'M',
        countryId: 2
    },
    {
        firstName: 'Jehlani',
        lastName: 'Gordon',
        gender: 'M',
        countryId: 2
    },
    {
        firstName: 'Kishane',
        lastName: 'Thompson',
        gender: 'M',
        countryId: 2
    }
];

const athleteSeasons = [
    // coleman
    {
        athleteId: 1,
        year: 2024,
        sb60m: 6.41,
        sb100m: 9.86,
        sb200m: 19.89,
        sb400m: null
    },
    // kerley
    {
        athleteId: 2,
        year: 2024,
        sb60m: 6.55,
        sb100m: 9.81,
        sb200m: 19.81,
        sb400m: null
    },
    // king
    {
        athleteId: 3,
        year: 2024,
        sb60m: 6.39,
        sb100m: 9.97,
        sb200m: 19.9,
        sb400m: null
    },
    // lindsey
    {
        athleteId: 4,
        year: 2024,
        sb60m: 6.33,
        sb100m: 9.97,
        sb200m: 19.71,
        sb400m: null
    },
    // bednarek
    {
        athleteId: 5,
        year: 2024,
        sb60m: 6.34,
        sb100m: 9.81,
        sb200m: 19.69,
        sb400m: 46.00
    },
    // blake
    {
        athleteId: 6,
        year: 2024,
        sb60m: 6.45,
        sb100m: 9.89,
        sb200m: 20.45,
        sb400m: null
    },
    // walker
    {
        athleteId: 7,
        year: 2024,
        sb60m: null,
        sb100m: 10.04,
        sb200m: null,
        sb400m: null
    },
    // gordon
    {
        athleteId: 8,
        year: 2024,
        sb60m: 6.60,
        sb100m: 10.05,
        sb200m: 21.02,
        sb400m: null
    },
    // thompson
    {
        athleteId: 9,
        year: 2024,
        sb60m: null,
        sb100m: 9.77,
        sb200m: null,
        sb400m: null
    }
];

const teams = [
    {
        countryId: 1,
        year: 2024,
        event: '4x100m',
        gender: 'M'
    },
    {
        countryId: 2,
        year: 2024,
        event: '4x100m',
        gender: 'M'
    }
];

const teamPerformances = [
    {
        teamId: 1,
        year: 2024,
        round: 'Heat 1',
        result: 37.47,
        status: 'OK'
    },
    {
        teamId: 1,
        year: 2024,
        round: 'Final',
        result: null,
        status: 'DQ'
    },
    {
        teamId: 2,
        year: 2024,
        round: 'Heat 2',
        result: 38.45,
        status: 'OK'
    }
];

const teamAthletes = [
    {
        teamId: 1,
        teamPerformanceId: 1,
        athleteId: 1,
        leg: 1
    },
    {
        teamId: 1,
        teamPerformanceId: 1,
        athleteId: 2,
        leg: 2
    },
    {
        teamId: 1,
        teamPerformanceId: 1,
        athleteId: 3,
        leg: 3
    },
    {
        teamId: 1,
        teamPerformanceId: 1,
        athleteId: 4,
        leg: 4
    },
    // USA Final Team
    {
        teamId: 1,
        teamPerformanceId: 2,
        athleteId: 1,
        leg: 1
    },
    {
        teamId: 1,
        teamPerformanceId: 2,
        athleteId: 5,
        leg: 2
    },
    {
        teamId: 1,
        teamPerformanceId: 2,
        athleteId: 3,
        leg: 3
    },
    {
        teamId: 1,
        teamPerformanceId: 2,
        athleteId: 2,
        leg: 4
    },
    // Jamaica Heat Team
    {
        teamId: 2,
        teamPerformanceId: 3,
        athleteId: 6,
        leg: 1
    },
    { teamId: 2,
        teamPerformanceId: 3,
        athleteId: 7,
        leg: 2
     },
    {
        teamId: 2,
        teamPerformanceId: 3,
        athleteId: 8,
        leg: 3
    },
    {
        teamId: 2,
        teamPerformanceId: 3,
        athleteId: 9,
        leg: 4
     }
];

insertManyCountries(countries);

insertManyAthletes(athletes);

insertManyAthleteSeasons(athleteSeasons);

insertManyTeams(teams);

insertManyTeamPerformances(teamPerformances);

insertManyTeamAthletes(teamAthletes);

const countriesPrint= db.prepare(
  'SELECT * FROM countries'
).all();

const athletesPrint = db.prepare(
  'SELECT * FROM athletes'
).all();

const athleteSeasonsPrint = db.prepare(
  'SELECT * FROM athlete_seasons'
).all();

const teamsPrint = db.prepare(
  'SELECT * FROM teams'
).all();

const teamPerformancesPrint = db.prepare(
  'SELECT * FROM team_performance'
).all();

const teamAthletesPrint = db.prepare(
  'SELECT * FROM team_athletes'
).all();

console.log(`countriesPrint: ${JSON.stringify(countriesPrint)}`);

console.log(`athletesPrint: ${JSON.stringify(athletesPrint)}`);

console.log(`athleteSeasonsPrint: ${JSON.stringify(athleteSeasonsPrint)}`);

console.log(`teamsPrint: ${JSON.stringify(teamsPrint)}`);

console.log(`teamPerformancesPrint: ${JSON.stringify(teamPerformancesPrint)}`);

console.log(`teamAthletesPrint: ${JSON.stringify(teamAthletesPrint)}`);