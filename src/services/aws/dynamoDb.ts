import AWS, { DynamoDB } from 'aws-sdk';
import _ from 'lodash';
import {
  PREVIOUS_NEWS_DB_NAME,
  PREVIOUS_NEWS_DB_PK,
  SYMBOL_DB_NAME,
  SYMBOL_DB_PK,
} from '../../constants';

const dynamodb = new AWS.DynamoDB();

type InsertData = { [key: string]: string | null };
export type TradeSymbol = {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
};

export const formatItemToObject = (item: DynamoDB.AttributeMap | undefined) => {
  if (item == null) return null;
  const keys = _.keys(item);
  if (keys.length === 0) return null;
  return _.mapValues(item, value => value.S || value.N || '');
};

export const formatObjectToItem = (data: InsertData): DynamoDB.AttributeMap =>
  _(data)
    .pickBy((value): value is string => !!value) // remove undefined values
    .mapValues(value => ({ S: value }))
    .value();

export const getSymbols = async (): Promise<TradeSymbol[]> => {
  const params = { TableName: SYMBOL_DB_NAME };
  const result = await dynamodb.scan(params).promise();
  if (result.Items == null)
    throw Error(`Items is undefined in ${SYMBOL_DB_NAME}`);
  const formatedItems = result.Items.map(formatItemToObject);
  if (formatedItems.some(item => item == null))
    throw Error(`Items contains null value ${SYMBOL_DB_NAME}`);
  return formatedItems as TradeSymbol[];
};

export const resetSymbols = async (symbols: TradeSymbol[]) => {
  // Drop current table
  const allKeys = await getSymbols();
  await Promise.all(
    allKeys.map(symbol => {
      const key = symbol[SYMBOL_DB_PK as keyof TradeSymbol];
      const params = {
        TableName: SYMBOL_DB_NAME,
        Key: { [SYMBOL_DB_PK]: { S: key } },
      };
      return dynamodb.deleteItem(params).promise();
    })
  );
  console.log(
    `${SYMBOL_DB_NAME} table has been droped of ${allKeys.length} objects.`
  );

  // Populate table
  await Promise.all(
    symbols.map(symbol => {
      const params = {
        TableName: SYMBOL_DB_NAME,
        Item: formatObjectToItem(symbol),
      };
      return dynamodb.putItem(params).promise();
    })
  );
  console.log(
    `${SYMBOL_DB_NAME} has been populated with ${symbols.length} objects.`
  );
};

export const getExistingUrl = async (url: string) => {
  const params = {
    TableName: PREVIOUS_NEWS_DB_NAME,
    Key: { [PREVIOUS_NEWS_DB_PK]: { S: url } },
    AttributesToGet: [PREVIOUS_NEWS_DB_PK],
  };
  const result = await dynamodb.getItem(params).promise();
  console.log('Fetched from DynamoDb', params, result);
  return formatItemToObject(result.Item);
};

const checkPrimaryKey = (data: InsertData) => {
  if (data[PREVIOUS_NEWS_DB_PK] == null) {
    throw Error(
      `Primary key ${PREVIOUS_NEWS_DB_PK} not found in ${JSON.stringify(data)}`
    );
  }
};

export const updateNews = async (data: InsertData) => {
  checkPrimaryKey(data);
  const formatedData = formatObjectToItem(data);
  const params = {
    TableName: PREVIOUS_NEWS_DB_NAME,
    Item: formatedData,
  };
  await dynamodb.putItem(params).promise();
  console.log('Inserted in DynamoDb', params);
};
