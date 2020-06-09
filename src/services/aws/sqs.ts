import AWS from 'aws-sdk';
import { TRADING_QUEUE_NAME, SELLER_QUEUE_NAME } from '../../constants';
import { LambdaTraderMessage, SellerMessage } from '../../types';

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
  await sqs.sendMessage(params).promise();
};

export const sendToTrader = (data: LambdaTraderMessage) =>
  sendToQueue(TRADING_QUEUE_NAME, data);

export const sendToSeller = (data: SellerMessage) =>
  sendToQueue(SELLER_QUEUE_NAME, data);
