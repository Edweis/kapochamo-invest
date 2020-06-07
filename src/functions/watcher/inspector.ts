import axios from 'axios';
import _get from 'lodash/get';
import { ScrapError } from '../../errors';
import { getLastUrl } from '../../services/aws/dynamoDb';
import Profiling from './profiling';

export const binanceInspectUrl =
  'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1';
export const binanceTitlePath = 'data.notices[0].title';
export const binanceUrlPath = 'data.notices[0].url';

export const binanceInspector = async (profiling?: Profiling) => {
  console.log('about to fetch news');
  const existingUrl = await getLastUrl();
  const response = await axios.get(binanceInspectUrl);
  if (profiling) profiling.log('Api call');
  const title = _get(response.data, binanceTitlePath, null);
  const url = _get(response.data, binanceUrlPath, null);
  if (url == null)
    throw new ScrapError('Got a null title :o', {
      response,
      binanceInspectUrl,
      binanceTitlePath,
    });
  if (profiling) profiling.log('Here is the url');
  console.debug('test', { existingUrl, url });
  return existingUrl === url ? null : { url, title };
};
