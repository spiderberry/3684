//requiring the better-sqlite3 module
const Database = require('better-sqlite3');

const db = new Database('3284.db');

db.pragma('foreign_keys = ON');

db.prepare(`
  CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT NOT NULL UNIQUE,
    country_code TEXT NOT NULL UNIQUE
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS athletes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    country_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    sb_100m REAL NOT NULL,
    sb_200m REAL NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    event TEXT NOT NULL,
    round TEXT NOT NULL,
    result REAL NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    UNIQUE(country_id, year, event, round)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS team_athletes (
    team_id INTEGER NOT NULL,
    athlete_id INTEGER NOT NULL,
    leg INTEGER NOT NULL,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    UNIQUE(team_id, athlete_id),
    UNIQUE(team_id, leg)
  )
`).run();

module.exports = db;