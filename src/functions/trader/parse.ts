import { TraderMessage } from './types';

export const parseMessage = (event: AWSLambda.SQSEvent): TraderMessage => {
  return JSON.parse(event.Records[0].body);
};
