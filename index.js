const db = require('./db');

const insert_country = db.prepare(`INSERT INTO countries (country, country_code) VALUES (?, ?)`);

const insert_athlete = db.prepare(`
  INSERT INTO athletes (first_name, last_name, country_id, year, sb_100m, sb_200m)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insert_team = db.prepare(`INSERT INTO teams (country_id, year, event, round, result) VALUES (?, ?, ?, ?, ?)`);

const insert_team_athlete = db.prepare(`INSERT INTO team_athletes (team_id, athlete_id, leg) VALUES (?, ?, ?)`);

insert_country.run('United States', 'USA');

insert_athlete.run('Christian', 'Coleman', 1, 2024, 9.86, 19.89);

insert_team.run(1, 2024, '4x100m', 'Heat 1', 37.47);

insert_team_athlete.run(1, 1, 1);

const countries = db.prepare(
  'SELECT * FROM countries'
).all();

const athletes = db.prepare(
  'SELECT * FROM athletes'
).all();

const teams = db.prepare(
  'SELECT * FROM teams'
).all();

const team_athletes = db.prepare(
  'SELECT * FROM team_athletes'
).all();

console.log(countries);

console.log(athletes);

console.log(teams);

console.log(team_athletes);