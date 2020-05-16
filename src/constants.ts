if (process.env.TRADING_QUEUE_NAME == null)
  throw Error('TRADING_QUEUE_NAME undefined');
export const { TRADING_QUEUE_NAME } = process.env;

if (process.env.TOPIC_EMAIL_NAME == null)
  throw Error('TOPIC_EMAIL_NAME undefined');
export const { TOPIC_EMAIL_NAME } = process.env;
