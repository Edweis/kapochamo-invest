CREATE TABLE news (
  id SERIAL NOT NULL PRIMARY KEY,
  title VARCHAR ,
  time TIMESTAMPTZ ,
  content VARCHAR,
  url VARCHAR
);

CREATE TABLE symbol (
  symbol VARCHAR NOT NULL PRIMARY KEY,
  status VARCHAR NOT NULL,
  base_asset VARCHAR NOT NULL,
  quote_asset VARCHAR NOT NULL
);

CREATE TABLE links (
  url VARCHAR NOT NULL PRIMARY KEY
);
