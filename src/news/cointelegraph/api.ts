import axios from 'axios';
import moment from 'moment-timezone';
import cheerio from 'cheerio';
import { Post } from './types';
const url = 'https://cointelegraph.com/api/v1/content/json/_tp';

type Params = {
  _token: string;
  lang: 'en';
  page: number;
  tag: string;
};
type Response = {
  posts: {
    per_page: number;
    top: Post[];
    recent: Post[];
  };
};
const params: Params = {
  page: 1,
  lang: 'en',
  _token: 'cWrERD3RQDDx5uhfy1WuqcH2HCBpuCkzwGhtAMB6',
  tag: 'business',
};

export const getPostContent = async (url: string) => {
  const contentPath = '.post-full-text.contents.js-post-full-text';
  const titlePath = '.post-header h1.header';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const content = $(contentPath).text();
  const title = $(titlePath)
    .text()
    .trim();
  return { title, content };
};

export const getPosts = async () => {
  const response = await axios.post<Response>(url, params);
  return response.data.posts.recent.map(post => ({
    ...post,
    when: moment(post.published.date)
      .tz(post.published.timezone)
      .fromNow(),
  }));
};
