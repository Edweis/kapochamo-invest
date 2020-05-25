import HttpStatus from 'http-status-codes';
import { Winner } from '../strategies';
import { successResponse, runWarm, errorResponse } from '../../helpers';
import { simulateBuyNow } from './simulation';
import { sendEmail } from '../../services/aws/sns';
import { parseMessage } from './parse';
import Order from '../order';

const FEES = 2 * 0.001;
const WIN_OF = FEES * 1.1;
const SELL_AFTER_LOSS_OF = 0.02;
const USDT_TO_BET = 30;

const emailMe = (message: { [key: string]: any }) =>
  sendEmail(JSON.stringify(message, null, '\t'));

const traderLambda: Function = async (event: AWSLambda.SQSEvent) => {
  try {
    const message = parseMessage(event);

    const strategy = new Winner(WIN_OF, SELL_AFTER_LOSS_OF);
    const order = new Order(message.symbol, USDT_TO_BET);
    order.logger = emailMe;
    strategy.setOrder(order);
    const report = await simulateBuyNow(strategy);

    await sendEmail(JSON.stringify(report, null, '\t'));
    return successResponse(
      { message: 'Success', report, event },
      HttpStatus.OK
    );
  } catch (error) {
    await sendEmail(JSON.stringify(error, null, '\t'));
    return errorResponse(error);
  }
};

export default runWarm(traderLambda);
