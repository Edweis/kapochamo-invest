import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import { successResponse } from '../helpers';
import { resetSymbols, TradeSymbol } from '../services/aws/dynamoDb';
import { binancePublic } from '../services/binance';

const keyToSaveInDb = ['symbol', 'status', 'baseAsset', 'quoteAsset'];
type ExchangeInfo = { symbols: TradeSymbol[] };
const populateSymbols: Function = async () => {
  const result = await binancePublic.get<ExchangeInfo>('/exchangeInfo');
  const cleanResults = result.data.symbols.map(symbol =>
    _.pick(symbol, keyToSaveInDb)
  ) as TradeSymbol[];
  await resetSymbols(cleanResults);
  return successResponse({ message: 'Success', cleanResults }, HttpStatus.OK);
};

export default populateSymbols;
