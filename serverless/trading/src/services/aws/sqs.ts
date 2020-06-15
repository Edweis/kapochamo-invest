import AWS from 'aws-sdk';
import { TRADING_QUEUE_NAME, SELLER_QUEUE_NAME } from '../../constants';
import { LambdaTraderMessage, SellerMessage } from '../../types';

const sqs = new AWS.SQS();
type SendMessageRequest = AWS.SQS.Types.SendMessageRequest;
const sendToQueue = async <T>(
  queueName: string,
  data: T,
  delaySec?: number
) => {
  const response = await sqs.getQueueUrl({ QueueName: queueName }).promise();
  const queueUrl = response.QueueUrl;
  if (queueUrl == null) throw Error(`Queue ${queueName} not found.`);
  const params: SendMessageRequest = {
    MessageBody: JSON.stringify(data),
    QueueUrl: queueUrl,
  };
  if (delaySec != null) params.DelaySeconds = delaySec;
  console.log(`Sending to queue ${queueName}`, params);
  await sqs.sendMessage(params).promise();
};

export const sendToTrader = (data: LambdaTraderMessage) =>
  sendToQueue(TRADING_QUEUE_NAME, data);

export const sendToSeller = (data: SellerMessage, delaySec?: number) =>
  sendToQueue(SELLER_QUEUE_NAME, data, delaySec);
