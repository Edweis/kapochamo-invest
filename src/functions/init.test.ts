import { scrapAllPagesInfo } from './populateNews';
import { populateSymbols } from './populateSymbols';
import { BinanceInfo } from '../types';
import moment from 'moment';
import {
  getAllAssets,
  getNews,
  getAssetsFromText,
  getAssetFromInfo,
  populateTickFromAsset,
} from './populateTicks';
import puppeteer from 'puppeteer';

jest.setTimeout(3000);

const headless = true;
let browser: puppeteer.Browser;

describe.skip('news', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless });
  });
  it('should run', async () => {
    await scrapAllPagesInfo(browser);
  });
  afterAll(async () => browser.close());
});

describe.skip('symbols', () => {
  it('should populate symbols', async () => {
    await populateSymbols();
  });
});

describe('ticks', () => {
  const title =
    'Binance Futures Will Launch LINK/USDT Perpetual Contract With Up to 75x Leverage';
  const date = new Date('2020-01-16 10:05:13');
  const INFO: BinanceInfo = {
    title,
    text: title,
    time: date.toISOString(),
    url: 'xxx',
  };
  const matchingAssets = ['LINK', 'USDT'];
  let assets: string[] = [];
  it('should populate ticks', async () => {
    assets = await getAllAssets();
    expect(assets.length).toBeGreaterThan(200);
  });
  it('should get the news', async () => {
    const news = await getNews();
    expect(news.length).toBeGreaterThan(30);
  });
  it('should find asset from string', () => {
    const matchAsset = getAssetsFromText(title, assets);
    expect(matchAsset).toEqual(matchingAssets);
  });
  it('should find asset from info', () => {
    const matchAsset = getAssetFromInfo(INFO, assets);
    expect(matchAsset).toEqual(matchingAssets);
  });
  it('should request for ticks on an asset', async () => {
    const ticks = await populateTickFromAsset(date, matchingAssets[0]);
    expect(ticks.length).toEqual(1000);
    const lastTickUnix = ticks[999][0] / 1000;
    const firstTickUnix = ticks[0][0] / 1000;
    const nowUnix = moment(date).unix();
    expect(lastTickUnix - firstTickUnix).toEqual(999 * 60);
    const rationInPast =
      (nowUnix - firstTickUnix) / (lastTickUnix - firstTickUnix);
    expect(Math.round(rationInPast * 100)).toEqual(25);
  });
});
