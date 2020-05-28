import puppeteer from 'puppeteer';
import {
  scrapLatestNews,
  scrapOnePageLinks,
  scrapAllPages,
  scrapPageInfo,
} from './scraping';
import { NEWS_LINKS } from './constants';

const headless = true;

jest.setTimeout(30000);

let browser: puppeteer.Browser;
describe.skip('scrapLatestNews', () => {
  it('should run', async () => {
    expect(await scrapLatestNews()).toBeTruthy();
  });
});

describe.skip('scrapOnePageLinks', () => {
  const initialLink =
    'https://binance.zendesk.com/hc/en-us/sections/115000106672-New-Crypto-Listings?page=4';
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless });
  });
  it('should run', async () => {
    const scrap = await scrapOnePageLinks(browser, initialLink);
    expect(scrap.links.length).toEqual(30);
    expect(scrap.nextPageLink).not.toEqual(null);
  });
  afterAll(() => browser.close());
});

describe.skip('scrapAllPages', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless });
  });
  it('should scrap all pages', async () => {
    const maxRun = 2;
    const links = await scrapAllPages(browser, NEWS_LINKS.LATEST, maxRun);
    expect(links.length).toEqual(2 * 30);
  });
  afterAll(async () => browser.close());
});

describe.skip('scrapPageInfo', () => {
  const link =
    'https://binance.zendesk.com/hc/en-us/articles/360041793272-Binance-Launches-Options-Trading-on-Mobile-App';
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless });
  });
  it('should scrap info on a page', async () => {
    const links = await scrapPageInfo(browser, link);
    expect(links.content).toContain('Fellow Binancians,');
    expect(links.content).toContain(
      'the official launch of Binance Options trading'
    );
    expect(links.time.toISOString()).toEqual('2020-04-13T07:41:44.000Z');
    expect(links.title).toContain(
      'Binance Launches Options Trading on Mobile App'
    );
  });
  afterAll(async () => browser.close());
});
