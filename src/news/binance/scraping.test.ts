import puppeteer from 'puppeteer';
import {
  scrapLatestNews,
  scrapOnePageLinks,
  scrapAllPages,
  scrapPageInfo,
} from './scraping';
import { NEWS_LINKS } from './constants';
import { PUPPETTER_PARAMS } from '../../helpers/common';

jest.setTimeout(30000);

let browser: puppeteer.Browser;
describe.skip('scrapLatestNews', () => {
  it('should run', async () => {
    expect(await scrapLatestNews()).toBeTruthy();
  });
});

beforeAll(async () => {
  browser = await puppeteer.launch(PUPPETTER_PARAMS);
});
afterAll(() => browser.close());
describe.skip('scrapOnePageLinks', () => {
  const initialLink =
    'https://binance.zendesk.com/hc/en-us/sections/115000106672-New-Crypto-Listings?page=4';
  it('should run', async () => {
    const scrap = await scrapOnePageLinks(browser, initialLink);
    expect(scrap.links.length).toEqual(30);
    expect(scrap.nextPageLink).not.toEqual(null);
  });
});

describe.skip('scrapAllPages', () => {
  it('should scrap all pages', async () => {
    const maxRun = 2;
    const links = await scrapAllPages(browser, NEWS_LINKS.LATEST, maxRun);
    expect(links.length).toEqual(2 * 30);
  });
});

describe.skip('scrapPageInfo', () => {
  const link =
    'https://binance.zendesk.com/hc/en-us/articles/360041793272-Binance-Launches-Options-Trading-on-Mobile-App';
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
});
