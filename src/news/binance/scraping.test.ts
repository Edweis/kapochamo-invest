import {
  scrapLatestNews,
  scrapOnePageLinks,
  scrapAllPages,
  scrapPageInfo,
} from './scraping';
import puppeteer from 'puppeteer';

const headless = true;

jest.setTimeout(30000);

let browser: puppeteer.Browser;
describe('scrapLatestNews', () => {
  it('should run', async () => {
    expect(await scrapLatestNews()).toBeTruthy();
  });
});

describe('scrapOnePageLinks', () => {
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

describe('scrapAllPages', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless });
  });
  it('should scrap all pages', async () => {
    const maxRun = 2;
    const links = await scrapAllPages(browser, maxRun);
    expect(links.length).toEqual(2 * 30);
  });
  afterAll(async () => browser.close());
});

describe('scrapPageInfo', () => {
  const link =
    'https://binance.zendesk.com/hc/en-us/articles/360041793272-Binance-Launches-Options-Trading-on-Mobile-App';
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless });
  });
  it('should scrap info on a page', async () => {
    const links = await scrapPageInfo(browser, link);
    expect(links.text).toContain('Fellow Binancians,');
    expect(links.text).toContain(
      'the official launch of Binance Options trading'
    );
    expect(links.time).toContain('2020-04-13T07:41:44Z');
    expect(links.title).toContain(
      'Binance Launches Options Trading on Mobile App'
    );
  });
  afterAll(async () => browser.close());
});
