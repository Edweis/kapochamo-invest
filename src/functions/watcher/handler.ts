import HttpStatus from 'http-status-codes';
import { successResponse, runWarm, errorResponse } from '../../helpers';
import { sendToTrader } from '../../services/aws/sqs';

const SHOULD_FAIL = false;
const testfunc: Function = async (event: {}) => {
  console.debug('Oh yeah !', event);
  await sendToTrader({ symbol: 'BTCUSDT' });
  if (SHOULD_FAIL) return errorResponse({ message: 'Watcher failed', event });
  return successResponse({ message: 'Success', event }, HttpStatus.OK);
};

export default runWarm(testfunc);
