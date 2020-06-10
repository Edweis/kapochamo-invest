
CREATE TABLE links (
  url VARCHAR NOT NULL PRIMARY KEY
);

CREATE TABLE news (
  url VARCHAR NOT NULL PRIMARY KEY,
  title VARCHAR,
  time TIMESTAMPTZ,
  content VARCHAR,
  FOREIGN KEY (url) REFERENCES links(url)
);

CREATE TABLE symbol (
  symbol VARCHAR NOT NULL PRIMARY KEY,
  status VARCHAR NOT NULL,
  "baseAsset" VARCHAR NOT NULL,
  "quoteAsset" VARCHAR NOT NULL
);

CREATE TABLE performance (
  url VARCHAR NOT NULL,
  strategy VARCHAR NOT NULL,
  symbol VARCHAR,
  performance FLOAT,
  extractor VARCHAR,
  FOREIGN KEY (url) REFERENCES links(url),
  PRIMARY KEY (url, strategy, symbol, extractor)
)
