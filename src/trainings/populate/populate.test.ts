// import puppeteer from 'puppeteer-extra';
import puppeteer, { Browser } from 'puppeteer';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {
  scrapAllPagesInfo,
  postLinks,
  // removeAllLinks,
  getAllLinks,
} from './populateNews';
import { populateSymbols } from './populateSymbols';
import { NEWS_LINKS } from '../../news/binance/constants';
import { scrapAllPages } from '../../news/binance/scraping';
import { PUPPETTER_PARAMS } from '../../helpers/common';

// puppeteer.use(StealthPlugin());

jest.setTimeout(300000);

let browser: Browser;

describe.skip('news', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch(PUPPETTER_PARAMS);
  });
  afterAll(async () => browser.close());
  // it.skip('should remove all links ', async () => {
  //   await removeAllLinks();
  // });
  it('should post announcements links', async () => {
    const newsAnnouncements = await scrapAllPages(
      browser,
      NEWS_LINKS.ANNOUNCEMENTS
    );
    await Promise.all(newsAnnouncements.map(postLinks));
  });
  it('should post latest links', async () => {
    const latestAnnouncements = await scrapAllPages(browser, NEWS_LINKS.LATEST);
    await Promise.all(latestAnnouncements.map(postLinks));
  });
  it('should get news from links', async () => {
    const links = await getAllLinks();
    await scrapAllPagesInfo(browser, links);
  });
});

describe.skip('symbols', () => {
  it('should populate symbols', async () => {
    await populateSymbols();
  });
});
