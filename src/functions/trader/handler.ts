import HttpStatus from 'http-status-codes';
import { Follower } from '../strategies';
import { successResponse, errorResponse } from '../../helpers';
import { simulateBuyNow } from './simulation';
import { parseMessage } from './parse';
import Order from '../order';
import { sendEmail } from '../../services/aws/sns';

// const FEES = 2 * 0.001;
// const WIN_OF = FEES * 1.1;
// const SELL_AFTER_LOSS_OF = 0.02;
const USDT_TO_BET = 30;

const traderLambda: Function = async (event: AWSLambda.SQSEvent) => {
  try {
    const message = parseMessage(event);

    const strategy = new Follower(0.02);
    const order = new Order(message.symbol, USDT_TO_BET);
    strategy.setOrder(order);
    const report = await simulateBuyNow(strategy);

    return successResponse(
      { message: 'Success', report, event },
      HttpStatus.OK
    );
  } catch (error) {
    await sendEmail(JSON.stringify(error, null, '\t'));
    return errorResponse(error);
  }
};

export default traderLambda;
