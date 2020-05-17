import AWS, { DynamoDB } from 'aws-sdk';
import _ from 'lodash';
import { PREVIOUS_NEWS_DB_NAME } from '../../constants';

console.debug({ PREVIOUS_NEWS_DB_NAME });
const dynamodb = new AWS.DynamoDB();

export const formatItem = (item: DynamoDB.AttributeMap | undefined) => {
  if (item == null) return null;
  const keys = _.keys(item);
  if (keys.length === 0) return null;
  return _.mapValues(item, value => value.S);
};

export const checkTitle = async (title: string) => {
  const params = {
    TableName: PREVIOUS_NEWS_DB_NAME,
    Key: { title: { S: title } },
  };
  const result = await dynamodb.getItem(params).promise();
  console.log('Fetched from DynamoDb', params, result);
  return formatItem(result.Item);
};

type InsertData = { [key: string]: string };
export const updateNews = async (data: InsertData) => {
  const formatedData = _.mapValues(data, value => ({ S: value }));
  const params = {
    TableName: PREVIOUS_NEWS_DB_NAME,
    Item: formatedData,
  };
  await dynamodb.putItem(params).promise();
  console.log('Inserted in DynamoDb', params);
};
