import HttpStatus from 'http-status-codes';
import { Winner } from '../strategies';
import { successResponse, runWarm } from '../../helpers';
import { simulateBuyNow } from './simulation';
import { sendEmail } from '../../services/aws/sns';
import { parseMessage } from './parse';
import Order from '../order';

const FEES = 2 * 0.001;
const WIN_OF = FEES * 1.1;
const SELL_AFTER_LOSS_OF = 0.02;
const USDT_TO_BET = 50;

const traderLambda: Function = async (event: AWSLambda.SQSEvent) => {
  const message = parseMessage(event);
  const strategy = new Winner(WIN_OF, SELL_AFTER_LOSS_OF);
  strategy.setOrder(new Order(message.symbol, USDT_TO_BET));
  const report = await simulateBuyNow(strategy);

  await sendEmail(JSON.stringify(report, null, '\t'));
  return successResponse({ message: 'Success', report, event }, HttpStatus.OK);
};

export default runWarm(traderLambda);
