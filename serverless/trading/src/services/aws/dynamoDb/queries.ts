import AWS from 'aws-sdk';
import {
  NEWS_TRIGGER_DB_NAME,
  NEWS_TRIGGER_DB_PK,
  SYMBOL_DB_NAME,
  SYMBOL_DB_PK,
  NEWS_TRIGGER_DB_VALUE,
} from '../../../constants';
import { TradeSymbol, formatItemToObject, formatObjectToItem } from './helpers';

const dynamodb = new AWS.DynamoDB();

let symbolCache: TradeSymbol[] | null = null;
export const getSymbols = async (): Promise<TradeSymbol[]> => {
  if (symbolCache != null) return symbolCache;
  const params = { TableName: SYMBOL_DB_NAME };
  const result = await dynamodb.scan(params).promise();
  if (result.Items == null)
    throw Error(`Items is undefined in ${SYMBOL_DB_NAME}`);
  const formatedItems = result.Items.map(formatItemToObject);
  if (formatedItems.some(item => item == null))
    throw Error(`Items contains null value ${SYMBOL_DB_NAME}`);
  symbolCache = formatedItems as TradeSymbol[];
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
    `${SYMBOL_DB_NAME} table has been dropped of ${allKeys.length} objects.`
  );

  // Populate table
  await Promise.all(
    symbols.map(symbol => {
      const params = {
        TableName: SYMBOL_DB_NAME,
        Item: formatObjectToItem(symbol),
      };
      // console.debug(params.Item[SYMBOL_DB_PK]);
      return dynamodb.putItem(params).promise();
    })
  );
  console.log(
    `${SYMBOL_DB_NAME} has been populated with ${symbols.length} objects.`
  );
};

const BINANCE_KEY = 'BINANCE';
export const getLastUrl = async () => {
  const params = {
    TableName: NEWS_TRIGGER_DB_NAME,
    Key: { [NEWS_TRIGGER_DB_PK]: { S: BINANCE_KEY } },
    AttributesToGet: [NEWS_TRIGGER_DB_VALUE],
  };
  const result = await dynamodb.getItem(params).promise();
  console.log('Fetched from DynamoDb', params, result);
  return result.Item && result.Item.url.S;
};

export const updateLastNews = async (url: string) => {
  const params = {
    TableName: NEWS_TRIGGER_DB_NAME,
    Item: {
      [NEWS_TRIGGER_DB_PK]: { S: BINANCE_KEY },
      [NEWS_TRIGGER_DB_VALUE]: { S: url },
    },
  };
  await dynamodb.putItem(params).promise();
  console.log('Inserted in DynamoDb', params);
};
