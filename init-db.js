//requiring the better-sqlite3 module
import Database from 'better-sqlite3';

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
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS athlete_seasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    athlete_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    country_id INTEGER NOT NULL,
    baseline_100m REAL,
    baseline_season INTEGER,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (country_id) REFERENCES countries(id),
    UNIQUE(athlete_id, year)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS meets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    city TEXT NOT NULL,
    type TEXT NOT NULL,
    UNIQUE(name, year)
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
    meet_id INTEGER NOT NULL,
    round TEXT NOT NULL,
    result REAL,
    status TEXT,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (meet_id) REFERENCES meets(id),
    UNIQUE(team_id, meet_id, round)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS team_athletes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_performance_id INTEGER NOT NULL,
    athlete_id INTEGER NOT NULL,
    leg INTEGER NOT NULL CHECK (leg BETWEEN 1 AND 4),
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (team_performance_id) REFERENCES team_performance(id),
    UNIQUE(team_performance_id, athlete_id),
    UNIQUE(team_performance_id, leg) 
  )
`).run();

export default db;