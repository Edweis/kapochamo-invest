export const isTest = process.env.JEST_WORKER_ID;

if (isTest) {
  process.env.TRADING_QUEUE_NAME = 'TRADING_QUEUE_NAME';
  process.env.TOPIC_EMAIL_NAME = 'TOPIC_EMAIL_NAME';
  process.env.PREVIOUS_NEWS_DB_NAME = 'PREVIOUS_NEWS_DB_NAME';
  process.env.PREVIOUS_NEWS_DB_PK = 'PREVIOUS_NEWS_DB_PK';
}
if (process.env.TRADING_QUEUE_NAME == null)
  throw Error('TRADING_QUEUE_NAME undefined');
if (process.env.TOPIC_EMAIL_NAME == null)
  throw Error('TOPIC_EMAIL_NAME undefined');
if (process.env.PREVIOUS_NEWS_DB_NAME == null)
  throw Error('PREVIOUS_NEWS_DB_NAME undefined');
if (process.env.PREVIOUS_NEWS_DB_PK == null)
  throw Error('PREVIOUS_NEWS_DB_PK undefined');

export const { TRADING_QUEUE_NAME } = process.env;
export const { TOPIC_EMAIL_NAME } = process.env;
export const { PREVIOUS_NEWS_DB_NAME } = process.env;
export const { PREVIOUS_NEWS_DB_PK } = process.env;
