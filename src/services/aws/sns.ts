import AWS from 'aws-sdk';
import { TOPIC_EMAIL_NAME } from '../../constants';

const sns = new AWS.SNS();

const publishToSns = async (topicName: string, data: string) => {
  const response = await sns.createTopic({ Name: topicName }).promise();
  const topicArn = response.TopicArn;
  if (topicArn == null) throw Error(`Topic ${topicName} not found.`);
  const params = {
    Subject: 'Kapochamo Invest',
    Message: data,
    TopicArn: topicArn,
  };
  console.log('Email sent');
  await sns.publish(params).promise();
};

export const sendEmail = async (data: string) => {
  await publishToSns(TOPIC_EMAIL_NAME, data);
};
