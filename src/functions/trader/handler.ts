import { Follower } from '../strategies';
import { simulateBuyNow } from './simulation';
import { parseMessage } from './parse';
import Order from '../order';
import { sendEmail } from '../../services/aws/sns';

const USDT_TO_BET = 30;

const traderLambda: Function = async (event: AWSLambda.SQSEvent) => {
  try {
    const message = parseMessage(event);

    const strategy = new Follower(0.02);
    const order = new Order(message.symbol, USDT_TO_BET);
    strategy.setOrder(order);
    const report = await simulateBuyNow(strategy);

    return { message: 'Success', report, event };
  } catch (error) {
    await sendEmail(JSON.stringify(error, null, '\t'));
    throw error;
  }
};

export default traderLambda;
