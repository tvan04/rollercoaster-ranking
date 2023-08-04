CREATE DATABASE rollercoaster_ranking;

CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT
);

CREATE TABLE coasters (
  ID SERIAL PRIMARY KEY,
  coaster_id INTEGER,
  park_id TEXT,
  coaster_name TEXT,
  park_name TEXT,
  rank INTEGER,
  user_id TEXT REFERENCES users(user_id)
);