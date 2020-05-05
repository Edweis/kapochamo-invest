import { getAllAssets, getOneNews, getSymbols } from './queries';
import { getAssetFromInfo } from './extractors/extract';
import { getTickAround } from './getNewsContext';
import { BinanceInfo } from '../../types';
import moment from 'moment';
import {
  TEST_OPTIMIST_NEWS_TITLE,
  TEST_LISTING_NEWS_TITLE,
} from '../../test-constants';

describe('Optimist news', () => {
  let assets: string[] = [];
  let testNews: BinanceInfo;
  const MATCHING_ASSETS = ['BNB', 'CTSI'];
  beforeAll(async () => {
    testNews = await getOneNews(TEST_OPTIMIST_NEWS_TITLE);
  });
  it('testNews should correspond to reality', () => {
    expect(testNews.title).toEqual(TEST_OPTIMIST_NEWS_TITLE);
    expect(testNews.time.toISOString()).toEqual('2020-04-13T09:53:13.000Z');
    expect(testNews.content).toMatch(/The Cartesi token sale/);
  });
  it('should populate ticks', async () => {
    assets = await getAllAssets();
    expect(assets.length).toBeGreaterThan(200);
  });
  it('should find asset from info', () => {
    const matchAsset = getAssetFromInfo(testNews, assets);
    expect(matchAsset).toEqual(MATCHING_ASSETS);
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
    const symbols = await getSymbols(MATCHING_ASSETS, MATCHING_ASSETS);
    expect(symbols).toEqual(['CTSIBNB']);
  });
});

describe('Listing news', () => {
  let assets: string[] = [];
  let testNews: BinanceInfo;
  const MATCHING_ASSETS = ['BNB', 'BTC', 'HIVE', 'USDT'];
  const MATCHING_SYMBOLS = [
    'BNBBTC',
    'BNBUSDT',
    'BTCUSDT',
    'HIVEBNB',
    'HIVEBTC',
    'HIVEUSDT',
  ];
  beforeAll(async () => {
    testNews = await getOneNews(TEST_LISTING_NEWS_TITLE);
  });
  it('testNews should correspond to reality', () => {
    expect(testNews.title).toEqual(TEST_LISTING_NEWS_TITLE);
    expect(testNews.time.toISOString()).toEqual('2020-04-27T03:57:00.000Z');
    expect(testNews.content).toMatch(/Binance will list Hive/);
  });
  it('should populate ticks', async () => {
    assets = await getAllAssets();
    expect(assets.length).toBeGreaterThan(200);
  });
  it('should find asset from info', () => {
    const matchAsset = getAssetFromInfo(testNews, assets);
    expect(matchAsset).toEqual(MATCHING_ASSETS);
  });
  it('should request for ticks on an asset', async () => {
    const hiveTicks = await getTickAround(testNews.time, 'HIVEBNB');
    expect(hiveTicks.length).toEqual(0); // news listing
    const bnbTicks = await getTickAround(testNews.time, 'BNBUSDT');
    expect(bnbTicks.length).toEqual(200);
  });
  it('get symbol from assets', async () => {
    const symbols = await getSymbols(MATCHING_ASSETS, MATCHING_ASSETS);
    expect(symbols).toEqual(MATCHING_SYMBOLS);
  });
});
