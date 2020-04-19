import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://cointelegraph.com/tags/business';
const linksPath = `
.tags-page__tabs-list
.post-preview-list-inline__item
.post-preview-item-inline__content
a.post-preview-item-inline__title-link`;
type Url = string;
type News = { href: Url; title: string };

export const scrapNews = async () => {
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);

  const data = $(linksPath).map((_, elem) => ({
    href: $(elem).attr('href'),
    title: $(elem)
      .text()
      .trim(),
  }));

  return data.get() as News[];
};
