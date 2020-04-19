import { scrapAllPagesInfo } from './initializeDatabase';
import puppeteer from 'puppeteer';

jest.setTimeout(300000);

const headless = false;
let browser: puppeteer.Browser;
describe.skip('scrapAllPagesInfo', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless });
  });
  it('should run', async () => {
    await scrapAllPagesInfo(browser);
  });
  afterAll(() => browser.close());
});
