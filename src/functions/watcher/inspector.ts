import axios from 'axios';
import _get from 'lodash/get';
import { ScrapError } from '../../errors';
import { getExistingUrl } from '../../services/aws/dynamoDb';
import BinanceInfoNEXT from './Info';

export const binanceInspectUrl =
  'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1';
export const binanceTitlePath = 'data.notices[0].title';
export const binanceLinkPath = 'data.notices[0].url';

export const binanceInspector = async (): Promise<BinanceInfoNEXT | null> => {
  console.log('about to fetch news');
  const response = await axios.get(binanceInspectUrl);
  const title = _get(response.data, binanceTitlePath, null);
  const link = _get(response.data, binanceLinkPath, null);
  console.log('news fetched:', { title, link });
  if (title == null)
    throw new ScrapError('Got a null title :o', {
      response,
      binanceInspectUrl,
      binanceTitlePath,
    });
  const existingUrl = await getExistingUrl(link);
  return existingUrl == null ? new BinanceInfoNEXT(link, title) : null;
};
