import { DynamoDB } from 'aws-sdk';
import _ from 'lodash';

export type InsertData = { [key: string]: string | null };
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
