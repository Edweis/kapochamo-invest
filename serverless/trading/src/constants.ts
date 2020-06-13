import dotenv from 'dotenv';

export const isTest = process.env.JEST_WORKER_ID != null;
export const isRunLocally = process.env.IS_LOCAL != null;
dotenv.config();

if (isTest) {
  process.env.SELLER_QUEUE_NAME = 'SELLER_QUEUE_NAME';
  process.env.TOPIC_EMAIL_NAME = 'TOPIC_EMAIL_NAME';
  process.env.NEWS_TRIGGER_DB_NAME = 'NEWS_TRIGGER_DB_NAME';
  process.env.NEWS_TRIGGER_DB_PK = 'url';
  process.env.BINANCE_API_KEY = 'BINANCE_API_KEY';
  process.env.BINANCE_PRIVATE_KEY = 'BINANCE_PRIVATE_KEY';
  process.env.SYMBOL_DB_NAME = 'SYMBOL_DB_NAME';
  process.env.SYMBOL_DB_PK = 'symbol';
  process.env.TRANSACTION_DB_NAME = 'TRANSACTION_DB_NAME';
  process.env.TRANSACTION_DB_PK = 'TRANSACTION_DB_PK';
  process.env.TRANSACTION_DB_SK = 'TRANSACTION_DB_SK';
  process.env.PUBLISHING_DB_NAME = 'PUBLISHING_DB_NAME';
  process.env.PUBLISHING_DB_PK = 'PUBLISHING_DB_PK';
  process.env.PUBLISHING_DB_SK = 'PUBLISHING_DB_SK';
}
if (process.env.SELLER_QUEUE_NAME == null)
  throw Error('SELLER_QUEUE_NAME undefined');
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
if (process.env.TRANSACTION_DB_NAME == null)
  throw Error('TRANSACTION_DB_NAME undefined');
if (process.env.TRANSACTION_DB_PK == null)
  throw Error('TRANSACTION_DB_PK undefined');
if (process.env.TRANSACTION_DB_SK == null)
  throw Error('TRANSACTION_DB_SK undefined');
if (process.env.PUBLISHING_DB_NAME == null)
  throw Error('PUBLISHING_DB_NAME undefined');
if (process.env.PUBLISHING_DB_PK == null)
  throw Error('PUBLISHING_DB_PK undefined');
if (process.env.PUBLISHING_DB_SK == null)
  throw Error('PUBLISHING_DB_SK undefined');

export const { SELLER_QUEUE_NAME } = process.env;
export const TRADING_QUEUE_NAME = SELLER_QUEUE_NAME;
export const { TOPIC_EMAIL_NAME } = process.env;
export const { NEWS_TRIGGER_DB_NAME } = process.env;
export const { NEWS_TRIGGER_DB_PK } = process.env;
export const { BINANCE_API_KEY } = process.env;
export const { BINANCE_PRIVATE_KEY } = process.env;
export const { SYMBOL_DB_NAME } = process.env;
export const { SYMBOL_DB_PK } = process.env;

export const { TRANSACTION_DB_NAME } = process.env;
export const { TRANSACTION_DB_PK } = process.env;
export const { TRANSACTION_DB_SK } = process.env;
export const { PUBLISHING_DB_NAME } = process.env;
export const { PUBLISHING_DB_PK } = process.env;
export const { PUBLISHING_DB_SK } = process.env;
export const NEWS_TRIGGER_DB_VALUE = 'url';
