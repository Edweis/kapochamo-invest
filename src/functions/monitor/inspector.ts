import axios from 'axios';
import _get from 'lodash/get';
import { ScrapError } from '../../errors';

export const binanceInspectUrl =
  'https://www.binance.com/gateway-api/v1/public/market/all?page=1&rows=1';
const binanceTitlePath = 'data.notices[0].title';

export const binanceInspector = async (latestTitle: string) => {
  const response = await axios.get(binanceInspectUrl);
  const title = _get(response.data, binanceTitlePath, null);
  if (title == null)
    throw new ScrapError('Got a null title :o', {
      response,
      binanceInspectUrl,
      binanceTitlePath,
    });
  return title !== latestTitle;
};
