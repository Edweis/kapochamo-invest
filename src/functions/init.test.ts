import {
  scrapAllPagesInfo,
  postLinks,
  removeAllLinks,
  getAllLinks,
} from './populateNews';
import { populateSymbols } from './populateSymbols';
import { BinanceInfo } from '../types';
import { NEWS_LINKS } from '../news/binance/constants';
import moment from 'moment';
import {
  getAllAssets,
  getNews,
  getOneNews,
  getAssetsFromText,
  getAssetFromInfo,
  getTickAround,
  getTicksAroundNews,
  getAllSymbolFromAsset,
} from './populateTicks';
import { scrapAllPages } from '../news/binance/scraping';
import puppeteer from 'puppeteer';

const TEST_NEWS_TITLE =
  'Introducing the Cartesi (CTSI) Token Sale on Binance Launchpad';

jest.setTimeout(3000000);

const headless = false;
let browser: puppeteer.Browser;

describe('news', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless });
  });
  // it.skip('should remove all links ', async () => {
  //   await removeAllLinks();
  // });
  it.skip('should post announcements links', async () => {
    const newsAnnouncements = await scrapAllPages(
      browser,
      NEWS_LINKS.ANNOUNCEMENTS
    );
    await Promise.all(newsAnnouncements.map(postLinks));
  });
  it.skip('should post latest links', async () => {
    const latestAnnouncements = await scrapAllPages(browser, NEWS_LINKS.LATEST);
    await Promise.all(latestAnnouncements.map(postLinks));
  });
  it('should get news from links', async () => {
    const links = await getAllLinks();
    await scrapAllPagesInfo(browser, links);
  });
  afterAll(async () => browser.close());
});

describe.skip('symbols', () => {
  it('should populate symbols', async () => {
    await populateSymbols();
  });
});

describe('ticks', () => {
  let assets: string[] = [];
  let testNews: BinanceInfo;
  const MATCHING_ASSETS = ['BNB', 'CTSI'];
  beforeAll(async () => {
    testNews = await getOneNews(TEST_NEWS_TITLE);
  });
  it('testNews should correspond to reality', async () => {
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
    expect(ticks[999][0]).toEqual(startMinuteUnix * 1000);
  });
  it('get symbol from assets', async () => {
    const symbols = await getAllSymbolFromAsset(MATCHING_ASSETS);
    expect(symbols.length).toEqual(155);
  });
  it('should write ticks in file', async () => {
    await getTicksAroundNews(testNews);
  });
});
