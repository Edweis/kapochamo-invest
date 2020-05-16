import axios from 'axios';
import _get from 'lodash/get';
import { ScrapError } from '../../errors';

export const binanceInspectUrl =
  'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1';
const binanceTitlePath = 'data.notices[0].title';
const binanceLinkPath = 'data.notices[0].url';

export const binanceInspector = async (
  latestTitle: string
): Promise<string | null> => {
  console.log('about to fetch news', { latestTitle });
  const response = await axios.get(binanceInspectUrl);
  const title = _get(response.data, binanceTitlePath, null);
  const link = _get(response.data, binanceLinkPath, null);
  console.log('new fetched:', response.data, { title, latestTitle, link });
  if (title == null)
    throw new ScrapError('Got a null title :o', {
      response,
      binanceInspectUrl,
      binanceTitlePath,
    });
  const isNew = title !== latestTitle;
  return isNew ? link : null;
};
