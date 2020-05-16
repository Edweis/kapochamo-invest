import HttpStatus from 'http-status-codes';
import { successResponse, runWarm, errorResponse } from '../helpers';
import { sendEmail } from '../services/aws/sns';

const SHOULD_FAIL = false;
const testfunc: Function = async (event: AWSLambda.SQSEvent) => {
  console.debug('Oh yeah !', event);
  await sendEmail('Hello');
  if (SHOULD_FAIL)
    return errorResponse({
      message: 'Image failed to upload',
      event,
    });

  return successResponse({ message: 'Success', event }, HttpStatus.OK);
};

export default runWarm(testfunc);
