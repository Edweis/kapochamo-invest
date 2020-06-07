import {
  getTradeableSymbols,
  extractCharly,
  isReady,
} from './simplifiedExtractors';
import { getSymbols } from '../../services/aws/dynamoDb/queries';
import { TEST_OPTIMIST_NEWS } from '../../test-constants';

jest.mock('../../services/aws/dynamoDb/queries');

describe('tradeableSymbols', () => {
  it('should return the right symbols', async () => {
    const symbols = await getSymbols();
    const res = getTradeableSymbols(symbols);
    expect(res.BNB).toEqual('BNBUSDT');
    expect(res.XXX).not.toBeTruthy();
  });
});

describe('extractCharly', () => {
  it('shou;d work for dummy title', async () => {
    await isReady;
    expect(extractCharly(TEST_OPTIMIST_NEWS.title)).toEqual([
      'CTSIUSDT',
      'BNBUSDT',
    ]);
  });
});
