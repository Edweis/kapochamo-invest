import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

export const getBrowser = async () =>
  puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });
