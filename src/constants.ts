if (process.env.TRADING_QUEUE_NAME == null)
  throw Error('TRADING_QUEUE_NAME undefined');
export const { TRADING_QUEUE_NAME } = process.env;
