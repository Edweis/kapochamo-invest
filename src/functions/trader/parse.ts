import { TraderMessage } from './types';
import { isRunLocally } from '../../constants';

export const parseMessage = (event: AWSLambda.SQSEvent): TraderMessage => {
  return isRunLocally
    ? ((event as unknown) as TraderMessage)
    : JSON.parse(event.Records[0].body);
};
