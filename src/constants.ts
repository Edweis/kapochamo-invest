import dotenv from 'dotenv';

export const isTest = process.env.JEST_WORKER_ID != null;
export const isRunLocally = process.env.IS_LOCAL != null;
dotenv.config();

if (isTest) {
  process.env.TRADING_QUEUE_NAME = 'TRADING_QUEUE_NAME';
  process.env.TOPIC_EMAIL_NAME = 'TOPIC_EMAIL_NAME';
  process.env.PREVIOUS_NEWS_DB_NAME = 'PREVIOUS_NEWS_DB_NAME';
  process.env.PREVIOUS_NEWS_DB_PK = 'PREVIOUS_NEWS_DB_PK';
  process.env.BINANCE_API_KEY = 'BINANCE_API_KEY';
  process.env.BINANCE_PRIVATE_KEY = 'BINANCE_PRIVATE_KEY';
  process.env.STATIC_DATA_BUCKET = 'STATIC_DATA_BUCKET';
}
if (process.env.TRADING_QUEUE_NAME == null)
  throw Error('TRADING_QUEUE_NAME undefined');
if (process.env.TOPIC_EMAIL_NAME == null)
  throw Error('TOPIC_EMAIL_NAME undefined');
if (process.env.PREVIOUS_NEWS_DB_NAME == null)
  throw Error('PREVIOUS_NEWS_DB_NAME undefined');
if (process.env.PREVIOUS_NEWS_DB_PK == null)
  throw Error('PREVIOUS_NEWS_DB_PK undefined');
if (process.env.BINANCE_API_KEY == null)
  throw Error('BINANCE_API_KEY undefined');
if (process.env.BINANCE_PRIVATE_KEY == null)
  throw Error('BINANCE_PRIVATE_KEY undefined');
if (process.env.STATIC_DATA_BUCKET == null)
  throw Error('STATIC_DATA_BUCKET undefined');

export const { TRADING_QUEUE_NAME } = process.env;
export const { TOPIC_EMAIL_NAME } = process.env;
export const { PREVIOUS_NEWS_DB_NAME } = process.env;
export const { PREVIOUS_NEWS_DB_PK } = process.env;
export const { BINANCE_API_KEY } = process.env;
export const { BINANCE_PRIVATE_KEY } = process.env;
export const { STATIC_DATA_BUCKET } = process.env;
