import HttpStatus from 'http-status-codes';
import { successResponse } from '../../helpers';
import { sendToTrader } from '../../services/aws/sqs';
import { updateNews } from '../../services/aws/dynamoDb';
import { binanceInspector } from './inspector';
import { filterByColdWord } from '../extractors';
import { watcherReportTemplate } from './report';

const binanceWatcherLambda: Function = async (event: {}) => {
  const info = await binanceInspector();
  if (info == null)
    return successResponse({ message: 'Not new', event }, HttpStatus.CONTINUE);
  updateNews({ url: info.url }); // not await not to block

  // We have a new news 🎉
  const symbols = await filterByColdWord(info);
  console.debug('About to trade ', symbols);
  await Promise.all(symbols.map(symbol => sendToTrader({ symbol, info })));
  await watcherReportTemplate(info, symbols);
  await updateNews(await info.toObject());

  return successResponse({ message: 'Success', event }, HttpStatus.OK);
};

export default binanceWatcherLambda;
