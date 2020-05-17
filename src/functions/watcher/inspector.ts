import axios from 'axios';
import _get from 'lodash/get';
import { ScrapError } from '../../errors';
import { getExistingTitle } from '../../services/aws/dynamoDb';

export const binanceInspectUrl =
  'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1';
export const binanceTitlePath = 'data.notices[0].title';
export const binanceLinkPath = 'data.notices[0].url';

export const binanceInspector = async (): Promise<string | null> => {
  console.log('about to fetch news');
  const response = await axios.get(binanceInspectUrl);
  const title = _get(response.data, binanceTitlePath, null);
  const link = _get(response.data, binanceLinkPath, null);
  console.log('news fetched:', response.data, { title, link });
  if (title == null)
    throw new ScrapError('Got a null title :o', {
      response,
      binanceInspectUrl,
      binanceTitlePath,
    });
  const existingTitle = await getExistingTitle(title);
  console.warn(existingTitle);
  return existingTitle == null ? link : null;
};
