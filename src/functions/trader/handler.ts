import HttpStatus from 'http-status-codes';
import { Follower } from '../strategies';
import { successResponse, runWarm } from '../../helpers';
import { simulateBuyNow } from './simulation';
import { sendEmail } from '../../services/aws/sns';
import { parseMessage } from './parse';
import { isRunLocally } from '../../constants';

const threshold = isRunLocally ? 0.0005 : 0.01;
const traderLambda: Function = async (event: AWSLambda.SQSEvent) => {
  const message = parseMessage(event);

  const report = await simulateBuyNow(new Follower(threshold), message.symbol);

  await sendEmail(JSON.stringify(report, null, '\t'));
  return successResponse({ message: 'Success', report, event }, HttpStatus.OK);
};

export default runWarm(traderLambda);
