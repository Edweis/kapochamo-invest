import HttpStatus from 'http-status-codes';
import { successResponse, runWarm, errorResponse } from '../../helpers';
import { simulateBuyNow } from './simulation';
import { sendEmail } from '../../services/aws/sns';
import { parseMessage } from './parse';

const testfunc: Function = async (event: AWSLambda.SQSEvent) => {
  const message = parseMessage(event);
  await sendEmail(`Started with ${JSON.stringify(message)}`);

  const report = await simulateBuyNow('BTCUSDT').catch(errorResponse);

  await sendEmail(JSON.stringify(report, null, '\t'));
  return successResponse({ message: 'Success', report, event }, HttpStatus.OK);
};

export default runWarm(testfunc);
