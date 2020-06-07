import { sendToTrader } from '../../services/aws/sqs';
import { updateLastNews } from '../../services/aws/dynamoDb';
import { binanceInspector } from './inspector';
import { watcherReportTemplate } from './report';
import { extractCharly, isReady } from '../extractors/simplifiedExtractors';
import Profiling from './profiling';

const binanceWatcherLambda: Function = async (event: {}) => {
  await isReady;
  const profiling = new Profiling();
  const info = await binanceInspector(profiling);
  profiling.log('Fetch news');
  if (info == null)
    return { message: 'Not new', profiling: profiling.toString(), event };
  profiling.log('Update News');

  // We have a new news 🎉
  const symbols = extractCharly(info.title);
  profiling.log('Extractor');

  await Promise.all(symbols.map(symbol => sendToTrader({ symbol, info })));
  await updateLastNews(info.url);
  profiling.log('Send to queue');

  await watcherReportTemplate(info.url, info.title, symbols);
  profiling.log('send template');
  return { message: 'Success', profiling: profiling.toString(), event };
};

export default binanceWatcherLambda;
