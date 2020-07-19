import puppeteer from 'puppeteer-core';
// import puppeteerLocal from 'puppeteer';
import chromium from 'chrome-aws-lambda';
// import { isRunLocally } from '../../constants';

export const getBrowser = async () =>
  // isRunLocally ? puppeteerLocal.launch({ headless: true }) :
  puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });
