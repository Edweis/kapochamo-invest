import pg from '../services/postgres';
import { scrapAllPages, scrapPageInfo } from '../news/binance/scraping';
import puppeteer from 'puppeteer';
import { BinanceInfo } from '../types';
import pLimit from 'p-limit';

const PARALLEL_RUN = 1;

const limit = pLimit(PARALLEL_RUN);
const insertNews = async (info: BinanceInfo) => {
  await pg.query(
    'INSERT INTO news(title, time, content, url) VALUES($1, $2, $3, $4) RETURNING *',
    [info.title, info.time, info.text, info.url]
  );
};
const removeAllNews = async () => pg.query('DELETE FROM news');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const scrapAllPagesInfo = async (browser: puppeteer.Browser) => {
  await removeAllNews();
  const links = await scrapAllPages(browser);
  await Promise.all(
    links.map(async link =>
      limit(async () => {
        const info = await scrapPageInfo(browser, link);
        await insertNews(info);
        await sleep(2000);
      })
    )
  );
};
