import HttpStatus from 'http-status-codes';
import { successResponse } from '../../helpers';
import { sendToTrader } from '../../services/aws/sqs';
import { binanceInspector } from './inspector';
import { scrapPageInfo } from '../../news/binance/scraping';
import { getBrowser } from './browser';
import { updateNews } from '../../services/aws/dynamoDb';
import { watcherReportTemplate } from './report';

const binanceWatcherLambda: Function = async (event: {}) => {
  const url = await binanceInspector();
  if (url == null)
    return successResponse({ message: 'Not new', event }, HttpStatus.CONTINUE);

  // We have a new news 🎉
  await updateNews({ url });
  const browser = await getBrowser();
  const info = await scrapPageInfo(browser, url);

  const symbols = ['BTCUSDT', 'BNBUSDT'];
  await Promise.all(symbols.map(symbol => sendToTrader({ symbol, info })));
  await updateNews({ ...info, addedAt: new Date().toISOString() });
  await watcherReportTemplate(info, symbols);

  return successResponse({ message: 'Success', event }, HttpStatus.OK);
};

export default binanceWatcherLambda;
