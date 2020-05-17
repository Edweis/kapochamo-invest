import HttpStatus from 'http-status-codes';
import { successResponse, runWarm, errorResponse } from '../helpers';
import { checkTitle, updateNews } from '../services/aws/dynamoDb';

const SHOULD_FAIL = false;
const testfunc: Function = async (event: AWSLambda.SQSEvent) => {
  console.debug('Oh yeah !', event);
  await updateNews({ title: 'hello', url: 'http', now: Date.now().toString() });
  const isTitleNew = await checkTitle('hello');
  console.warn({ isTitleNew });

  if (SHOULD_FAIL)
    return errorResponse({
      message: 'Image failed to upload',
      event,
    });

  return successResponse({ message: 'Success', event }, HttpStatus.OK);
};

export default runWarm(testfunc);
