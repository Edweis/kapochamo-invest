import puppeteer from 'puppeteer';
import pLimit from 'p-limit';
import pg from '../../services/postgres';
import { scrapPageInfo } from '../../news/binance/scraping';
import { BinanceInfo } from '../../types';
import { sleep } from '../../helpers';
import BinanceInfoNEXT from '../../functions/watcher/Info';

const PARALLEL_RUN = 5;
const limit = pLimit(PARALLEL_RUN);

const insertNews = async (info: BinanceInfo) => {
  const time = await info.getTime();
  const content = await info.getContent();
  await pg.query(
    'INSERT INTO news(title, time, content, url) VALUES($1, $2, $3, $4) RETURNING *',
    [info.title, time, content, info.url]
  );
};
// const removeAllNews = async () => pg.query('DELETE FROM news');
export const removeAllLinks = async () => pg.query('DELETE FROM links');
export const postLinks = async (url: string) =>
  pg.query('INSERT INTO links(url) VALUES ($1)', [url]);
export const getAllLinks = async () =>
  pg
    .query<{ url: string }>(
      'SELECT url FROM links ORDER BY substring(url, 47, 12) DESC' // most recent first
    )
    .then(result => result.rows.map(({ url }) => url));
export const checkNewsExists = async (url: string) => {
  const result = await pg.query<{ count: number }>(
    'SELECT count(*) as count FROM news WHERE url=$1',
    [url]
  );
  return result.rows[0].count > 0;
};

export const scrapAllPagesInfo = async (
  browser: puppeteer.Browser,
  links: string[]
) =>
  Promise.all(
    links.map(async link =>
      limit(async () => {
        const hasBeenFetched = await checkNewsExists(link);
        console.debug(`working on ${link}`);
        if (hasBeenFetched) {
          console.debug('Abort. Already have.');
          return;
        }
        const info = await scrapPageInfo(browser, link);

        await insertNews(BinanceInfoNEXT.fromObject(info));
        await sleep(2000);
      })
    )
  );
