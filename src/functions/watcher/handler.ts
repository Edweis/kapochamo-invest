import HttpStatus from 'http-status-codes';
import { successResponse } from '../../helpers';
import { sendToTrader } from '../../services/aws/sqs';
import { updateNews } from '../../services/aws/dynamoDb';
import { binanceInspector } from './inspector';
import { scrapPageInfo } from '../../news/binance/scraping';
import { getBrowser } from './browser';
import { filterByColdWord } from '../extractors';
import { watcherReportTemplate } from './report';

const binanceWatcherLambda: Function = async (event: {}) => {
  const url = await binanceInspector();
  if (url == null)
    return successResponse({ message: 'Not new', event }, HttpStatus.CONTINUE);

  // We have a new news 🎉
  await updateNews({ url });
  const browser = await getBrowser();
  const info = await scrapPageInfo(browser, url);

  const symbols = await filterByColdWord(info);
  console.debug('About to trade ', symbols);
  await Promise.all(symbols.map(symbol => sendToTrader({ symbol, info })));
  await watcherReportTemplate(info, symbols);
  await updateNews({
    ...info,
    time: info.time.toISOString(),
    addedAt: new Date().toISOString(),
  });

  return successResponse({ message: 'Success', event }, HttpStatus.OK);
};

export default binanceWatcherLambda;
