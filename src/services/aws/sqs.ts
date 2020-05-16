import AWS from 'aws-sdk';
import { TRADING_QUEUE_NAME } from '../../constants';
import { LambdaTraderPayload } from '../../types';

const sqs = new AWS.SQS();

const sendToQueue = async <T>(queueName: string, data: T) => {
  const response = await sqs.getQueueUrl({ QueueName: queueName }).promise();
  const queueUrl = response.QueueUrl;
  if (queueUrl == null) throw Error(`Queue ${queueName} not found.`);
  const params = {
    MessageBody: JSON.stringify(data),
    QueueUrl: queueUrl,
  };
  console.log(`Sending to queue ${queueName}`, params);
  return sqs.sendMessage(params).promise();
};

export const sendToTrader = (data: LambdaTraderPayload) =>
  sendToQueue(TRADING_QUEUE_NAME, data);
