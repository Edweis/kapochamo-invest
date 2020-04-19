import pg from '../services/postgres';
import { scrapAllPages, scrapPageInfo } from '../news/binance/scraping';
import puppeteer from 'puppeteer';
import { BinanceInfo } from '../types';
import pLimit from 'p-limit';

const PARALLEL_RUN = 1;

const limit = pLimit(PARALLEL_RUN);
const insertNews = async (info: BinanceInfo) => {
  await pg.query(
    'INSERT INTO news(title, time, content) VALUES($1, $2, $3) RETURNING *',
    [info.title, info.time, info.text]
  );
};
const removeAllNews = async () => pg.query('DELETE FROM news');

export const scrapAllPagesInfo = async (browser: puppeteer.Browser) => {
  await removeAllNews();
  const links = await scrapAllPages(browser);
  await Promise.all(
    links.map(async link =>
      limit(async () => {
        const info = await scrapPageInfo(browser, link);
        await insertNews(info);
      })
    )
  );
};
