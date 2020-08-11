import axios from 'axios';
import _get from 'lodash/get';
import { ScrapError } from '../../errors';
import { getLastUrl } from '../../services/aws/dynamoDb';
import Profiling from './profiling';

const MAX_ID = 1000000; // arbitrary
export const BINANCE_INSPECT_URL =
  'https://www.binance.com/gateway-api/v1/public/cms/article/latest/query';
const NEWS_URL_PREFIX = 'https://www.binance.com/en/support/articles/';
export const TITLE_PATH = 'data.latestArticles[0].title';
export const CODE_PATH = 'data.latestArticles[0].code';

const generateRandomId = () => Math.floor(Math.random() * Math.floor(MAX_ID));
export const binanceInspector = async (profiling?: Profiling) => {
  const existingUrl = await getLastUrl();
  const id = generateRandomId();
  const response = await axios.get(BINANCE_INSPECT_URL, { params: { id } });
  if (profiling) profiling.log('Api call');
  const url = NEWS_URL_PREFIX + _get(response.data, CODE_PATH, null);
  if (url == null)
    throw new ScrapError('Got a null title :o', {
      response,
      BINANCE_INSPECT_URL,
      TITLE_PATH,
    });
  if (profiling) profiling.log('Here is the url');
  if (existingUrl === url) return null;
  const title = _get(response.data, TITLE_PATH, null);
  return { url, title };
};
