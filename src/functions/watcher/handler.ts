import HttpStatus from 'http-status-codes';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import { successResponse, runWarm, errorResponse } from '../../helpers';
import { sendToTrader } from '../../services/aws/sqs';
import { binanceInspector } from './inspector';
import { scrapPageInfo } from '../../news/binance/scraping';

const latestTitle = 'bob';
const SHOULD_FAIL = false;
const testfunc: Function = async (event: {}) => {
  console.debug('Oh yeah !', event);

  const link = await binanceInspector(latestTitle);
  if (link == null)
    return successResponse({ message: 'Not new', event }, HttpStatus.CONTINUE);

  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });
  const info = await scrapPageInfo(browser, link);

  await sendToTrader({ symbol: 'BTCUSDT', info });
  if (SHOULD_FAIL) return errorResponse({ message: 'Watcher failed', event });
  return successResponse({ message: 'Success', event }, HttpStatus.OK);
};

export default runWarm(testfunc);
