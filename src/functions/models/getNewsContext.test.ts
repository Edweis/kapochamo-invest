import { getAllAssets, getOneNews, getAllSymbolFromAsset } from './queries';
import { getAssetFromInfo } from './extract';
import { getTickAround } from './getNewsContext';
import { BinanceInfo } from '../../types';
import { getTicksAroundNews } from './populateTicks';
import moment from 'moment';

const TEST_NEWS_TITLE =
  'Introducing the Cartesi (CTSI) Token Sale on Binance Launchpad';

describe('ticks', () => {
  let assets: string[] = [];
  let testNews: BinanceInfo;
  const MATCHING_ASSETS = ['BNB', 'CTSI'];
  beforeAll(async () => {
    testNews = await getOneNews(TEST_NEWS_TITLE);
  });
  it('testNews should correspond to reality', () => {
    expect(testNews.title).toEqual(TEST_NEWS_TITLE);
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
    expect(ticks[99].openTime).toEqual(startMinuteUnix * 1000);
  });
  it('get symbol from assets', async () => {
    const symbols = await getAllSymbolFromAsset(MATCHING_ASSETS);
    expect(symbols.length).toEqual(155);
  });
});
