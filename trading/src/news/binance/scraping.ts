import axios from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export const scrapLatestNews = async () => {
  const url = 'https://www.binance.com/en';
  const linksPath = `.css-n876bn > .css-vurnku`;
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  return $(linksPath).text();
};

const domain = 'https://binance.zendesk.com';
const READY_PATH = 'main[role=main]';
const SECURITY_CHECK_PATH = 'h1.err__page-heading';
const HEAD_FULL_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.0 Safari/537.36';

export const scrapOnePageLinks = async (
  browser: puppeteer.Browser,
  url: string
) => {
  const page = await browser.newPage();
  await page.setUserAgent(HEAD_FULL_AGENT);
  await page.goto(url);
  await page.waitFor(READY_PATH);
  const { nextPageLink, links } = await page.evaluate(() => {
    const linksPath = '.article-list > li.article-list-item > a';
    const links = [...document.querySelectorAll(linksPath)]
      .map(element => element.getAttribute('href'))
      .filter((link): link is string => link != null);

    const nextPagePath = '.pagination  li > a[rel=next]';
    const nextPage = document.querySelector(nextPagePath);
    const nextPageLink = nextPage?.getAttribute('href');

    return { nextPageLink, links };
  });
  await page.close();
  return { nextPageLink, links };
};

export const scrapAllPages = async (
  browser: puppeteer.Browser,
  initialLink: string,
  pageMax: number | null = null
) => {
  const allLinks: string[] = [];
  const scrap = async (link: string) => {
    console.warn('about to scrap', link);
    const res = await scrapOnePageLinks(browser, domain + link);
    allLinks.push(...res.links);
    return res.nextPageLink;
  };
  let nextLink: string | null | undefined = initialLink;
  let count = 0;
  while (nextLink != null && (pageMax == null || count < pageMax)) {
    count += 1;
    // eslint-disable-next-line no-await-in-loop
    nextLink = await scrap(nextLink);
  }
  return allLinks.map(link => domain + link);
};

export const scrapPageInfo = async (
  browser: puppeteer.Browser,
  url: string
) => {
  const page = await browser.newPage();
  await page.setUserAgent(HEAD_FULL_AGENT);
  console.debug(`about to scrap ${url}`);
  await page.goto(url);
  await Promise.race([
    page.waitFor(READY_PATH),
    page.waitFor(SECURITY_CHECK_PATH).then(() => {
      throw Error('Security Error');
    }),
  ]);
  const infos = await page.evaluate(() => {
    const headerPath = 'article.article header.article-header';
    const timePath = `${headerPath} div.article-author li.meta-data time`;
    const titlePath = `${headerPath} h1.article-title`;
    const contentPath = 'article.article section.article-info div.article-body';
    const title =
      document
        .querySelector(titlePath)
        ?.textContent?.trim()
        .replace('\n', '') || '';
    const time =
      document
        .querySelector(timePath)
        ?.getAttribute('datetime')
        ?.trim() || '';
    const content =
      document.querySelector(contentPath)?.textContent?.trim() || '';

    return { title, time, content };
  });
  await page.close();
  return { ...infos, time: new Date(infos.time), url };
};
