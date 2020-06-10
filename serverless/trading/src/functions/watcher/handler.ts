import { sendToSeller } from '../../services/aws/sqs';
import { updateLastNews } from '../../services/aws/dynamoDb';
import { binanceInspector } from './inspector';
import { watcherReportTemplate } from './report';
import { extractCharly, isReady } from '../extractors/simplifiedExtractors';
import Profiling from './profiling';
import { sendOrder } from '../../services/binance';
import { sendEmail } from '../../services/aws/sns';

const USDT_TO_BET = 150;
const binanceWatcherLambda: Function = async (event: {}) => {
  const profiling = new Profiling();
  await isReady;
  profiling.log('Setup');
  const info = await binanceInspector(profiling);
  profiling.log('Fetch news');
  if (info == null) {
    console.debug(profiling.toString());
    return { message: 'Not new', profiling: profiling.toString(), event };
  }
  profiling.log('Update News');

  // We have a new news 🎉
  const symbols = extractCharly(info.title);
  profiling.log('Extractor');

  await Promise.all(
    symbols.map(async symbol => {
      const response = await sendOrder('BUY', symbol, USDT_TO_BET);
      await sendToSeller(response.data);
    })
  );
  await updateLastNews(info.url);
  const report = await watcherReportTemplate(
    info.url,
    info.title,
    symbols,
    profiling
  );
  await sendEmail(report);
  profiling.log('send template');
  return profiling.toString();
};

export default binanceWatcherLambda;
