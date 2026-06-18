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
    gender TEXT NOT NULL,
    country_id INTEGER NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS athlete_seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    athlete_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    sb_60m REAL,
    sb_100m REAL,
    sb_200m REAL,
    sb_400m REAL,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    CONSTRAINT chk_at_least_one CHECK (sb_60m IS NOT NULL OR sb_100m IS NOT NULL OR sb_200m IS NOT NULL OR sb_400m IS NOT NULL)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country_id INTEGER NOT NULL,
    event TEXT NOT NULL,
    gender TEXT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    UNIQUE(country_id, event, gender)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS team_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    round TEXT NOT NULL,
    result REAL,
    status TEXT,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    UNIQUE(team_id, year, round)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS team_athletes (
    team_id INTEGER NOT NULL,
    team_performance_id INTEGER NOT NULL,
    athlete_id INTEGER NOT NULL,
    leg INTEGER NOT NULL,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (team_performance_id) REFERENCES team_performance(id),
    UNIQUE(team_id, team_performance_id, athlete_id),
    UNIQUE(team_id, team_performance_id, leg)
  )
`).run();

module.exports = db;