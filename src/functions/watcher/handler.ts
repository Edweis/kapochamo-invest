import HttpStatus from 'http-status-codes';
import { successResponse, runWarm } from '../../helpers';
import { sendToTrader } from '../../services/aws/sqs';
import { binanceInspector } from './inspector';
import { scrapPageInfo } from '../../news/binance/scraping';
import { getBrowser } from './browser';
import { updateNews } from '../../services/aws/dynamoDb';

const testfunc: Function = async (event: {}) => {
  console.debug('Oh yeah !', event);

  const url = await binanceInspector();
  if (url == null)
    return successResponse({ message: 'Not new', event }, HttpStatus.CONTINUE);

  // We have a new news 🎉
  await updateNews({ url });
  const browser = await getBrowser();
  const info = await scrapPageInfo(browser, url);

  await sendToTrader({ symbol: 'BTCUSDT', info });
  await updateNews(info);

  return successResponse({ message: 'Success', event }, HttpStatus.OK);
};

export default runWarm(testfunc);
