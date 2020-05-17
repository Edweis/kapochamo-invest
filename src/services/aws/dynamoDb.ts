import AWS, { DynamoDB } from 'aws-sdk';
import _ from 'lodash';
import { PREVIOUS_NEWS_DB_NAME, PREVIOUS_NEWS_DB_PK } from '../../constants';

const dynamodb = new AWS.DynamoDB();

export const formatItem = (item: DynamoDB.AttributeMap | undefined) => {
  if (item == null) return null;
  const keys = _.keys(item);
  if (keys.length === 0) return null;
  return _.mapValues(item, value => value.S);
};

export const getExistingTitle = async (title: string) => {
  const params = {
    TableName: PREVIOUS_NEWS_DB_NAME,
    Key: { title: { S: title } },
  };
  const result = await dynamodb.getItem(params).promise();
  console.log('Fetched from DynamoDb', params, result);
  return formatItem(result.Item);
};

type InsertData = { [key: string]: string | null };
const checkPrimaryKey = (data: InsertData) => {
  if (data[PREVIOUS_NEWS_DB_PK] == null) {
    throw Error(
      `Primary key ${PREVIOUS_NEWS_DB_PK} not found in ${JSON.stringify(data)}`
    );
  }
};

export const updateNews = async (data: InsertData) => {
  checkPrimaryKey(data);
  const formatedData = _.mapValues(data, value => ({ S: value }));
  const params = {
    TableName: PREVIOUS_NEWS_DB_NAME,
    Item: formatedData,
  };
  await dynamodb.putItem(params).promise();
  console.log('Inserted in DynamoDb', params);
};
