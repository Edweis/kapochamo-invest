import HttpStatus from 'http-status-codes';
import { successResponse, runWarm } from '../../helpers';
import { simulateBuyNow } from './simulation';
import { sendEmail } from '../../services/aws/sns';
import { parseMessage } from './parse';

const traderLambda: Function = async (event: AWSLambda.SQSEvent) => {
  const message = parseMessage(event);
  await sendEmail(`Start with ${JSON.stringify(message, null, '\t')}`);

  const report = await simulateBuyNow('BTCUSDT').catch(async error => {
    await sendEmail(JSON.stringify(error, null, '\t'));
    throw error;
  });

  await sendEmail(JSON.stringify(report, null, '\t'));
  return successResponse({ message: 'Success', report, event }, HttpStatus.OK);
};

export default runWarm(traderLambda);
