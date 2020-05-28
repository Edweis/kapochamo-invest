import moment from 'moment';
import {
  getAllAssets,
  getCombinedSymbols,
} from '../functions/extractors/helpers';
import { getTickAround } from './getNewsContext';
import { TEST_OPTIMIST_NEWS, TEST_LISTING_NEWS } from '../test-constants';

jest.setTimeout(10000);
jest.mock('../services/aws/dynamoDb/queries');
describe('Optimist news', () => {
  let assets: string[] = [];
  const testNews = TEST_OPTIMIST_NEWS;
  const MATCHING_ASSETS = ['BNB', 'CTSI'];
  it('should populate ticks', async () => {
    assets = await getAllAssets();
    expect(assets.length).toBeGreaterThan(100);
  });
  it('should request for ticks on an asset', async () => {
    const ticks = await getTickAround(testNews.time, 'BNBUSDT');
    expect(ticks.length).toEqual(200);
    const startMinuteUnix = moment(testNews.time)
      .startOf('m')
      .unix();
    ticks.find(tick => tick.openTime === startMinuteUnix * 1000);
    expect(ticks[99].openTime).toEqual(startMinuteUnix * 1000);
  });
  it('get symbol from assets', async () => {
    const symbols = await getCombinedSymbols(MATCHING_ASSETS, MATCHING_ASSETS);
    expect(symbols).toEqual(['CTSIBNB']);
  });
});

describe('Listing news', () => {
  let assets: string[] = [];
  const testNews = TEST_LISTING_NEWS;
  const MATCHING_ASSETS = ['BNB', 'BTC', 'HIVE', 'USDT'];
  const MATCHING_SYMBOLS = [
    'BNBBTC',
    'BNBUSDT',
    'BTCUSDT',
    'HIVEBNB',
    'HIVEBTC',
    'HIVEUSDT',
  ];
  it('testNews should correspond to reality', () => {
    expect(testNews.time.toISOString()).toEqual('2020-04-27T03:57:00.000Z');
    expect(testNews.content).toMatch(/Binance will list Hive/);
  });
  it('should populate ticks', async () => {
    assets = await getAllAssets();
    expect(assets.length).toBeGreaterThan(200);
  });
  it('should request for ticks on an asset', async () => {
    const hiveTicks = await getTickAround(testNews.time, 'HIVEBNB');
    expect(hiveTicks.length).toEqual(0); // news listing
    const bnbTicks = await getTickAround(testNews.time, 'BNBUSDT');
    expect(bnbTicks.length).toEqual(200);
  });
  it('get symbol from assets', async () => {
    const symbols = await getCombinedSymbols(MATCHING_ASSETS, MATCHING_ASSETS);
    expect(symbols).toEqual(MATCHING_SYMBOLS);
  });
});
