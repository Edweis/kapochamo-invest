import HttpStatus from 'http-status-codes';
import { successResponse, runWarm, errorResponse } from '../helpers';
import { simulateBuyNow } from './monitor/simulation';

const testfunc: Function = async (event: AWSLambda.SQSEvent) => {
  console.debug('Trader', event);
  const tick = await simulateBuyNow('BTCUSDT').catch(errorResponse);
  return successResponse({ message: 'Success', tick, event }, HttpStatus.OK);
};

export default runWarm(testfunc);
