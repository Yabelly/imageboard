DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    first           VARCHAR(255) NOT NULL CHECK (first != ''),
    last            VARCHAR(255) NOT NULL CHECK (last != ''),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    profile_pic     VARCHAR,
    bio             VARCHAR,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE friendships(
      id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      recipient_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      accepted BOOLEAN
  );