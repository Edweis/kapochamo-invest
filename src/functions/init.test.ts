import {
  scrapAllPagesInfo,
  postLinks,
  // removeAllLinks,
  getAllLinks,
} from './populateNews';
import { populateSymbols } from './populateSymbols';
import { NEWS_LINKS } from '../news/binance/constants';
import { scrapAllPages } from '../news/binance/scraping';
import puppeteer from 'puppeteer';

jest.setTimeout(300000);

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
