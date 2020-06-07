import dotenv from 'dotenv';

export const isTest = process.env.JEST_WORKER_ID != null;
export const isRunLocally = process.env.IS_LOCAL != null;
dotenv.config();

if (isTest) {
  process.env.TRADING_QUEUE_NAME = 'TRADING_QUEUE_NAME';
  process.env.TOPIC_EMAIL_NAME = 'TOPIC_EMAIL_NAME';
  process.env.NEWS_TRIGGER_DB_NAME = 'NEWS_TRIGGER_DB_NAME';
  process.env.NEWS_TRIGGER_DB_PK = 'url';
  process.env.BINANCE_API_KEY = 'BINANCE_API_KEY';
  process.env.BINANCE_PRIVATE_KEY = 'BINANCE_PRIVATE_KEY';
  process.env.SYMBOL_DB_NAME = 'SYMBOL_DB_NAME';
  process.env.SYMBOL_DB_PK = 'symbol';
}
if (process.env.TRADING_QUEUE_NAME == null)
  throw Error('TRADING_QUEUE_NAME undefined');
if (process.env.TOPIC_EMAIL_NAME == null)
  throw Error('TOPIC_EMAIL_NAME undefined');
if (process.env.NEWS_TRIGGER_DB_NAME == null)
  throw Error('NEWS_TRIGGER_DB_NAME undefined');
if (process.env.NEWS_TRIGGER_DB_PK == null)
  throw Error('NEWS_TRIGGER_DB_PK undefined');
if (process.env.BINANCE_API_KEY == null)
  throw Error('BINANCE_API_KEY undefined');
if (process.env.BINANCE_PRIVATE_KEY == null)
  throw Error('BINANCE_PRIVATE_KEY undefined');
if (process.env.SYMBOL_DB_NAME == null) throw Error('SYMBOL_DB_PK undefined');
if (process.env.SYMBOL_DB_PK == null) throw Error('SYMBOL_DB_PK undefined');

export const { TRADING_QUEUE_NAME } = process.env;
export const { TOPIC_EMAIL_NAME } = process.env;
export const { NEWS_TRIGGER_DB_NAME } = process.env;
export const { NEWS_TRIGGER_DB_PK } = process.env;
export const { BINANCE_API_KEY } = process.env;
export const { BINANCE_PRIVATE_KEY } = process.env;
export const { SYMBOL_DB_NAME } = process.env;
export const { SYMBOL_DB_PK } = process.env;

export const NEWS_TRIGGER_DB_VALUE = 'url';
