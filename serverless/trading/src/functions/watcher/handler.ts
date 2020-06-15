import { sendToSeller } from '../../services/aws/sqs';
import {
  updateLastNews,
  insertTransaction,
  insertPublication,
} from '../../services/aws/dynamoDb';
import { binanceInspector } from './inspector';
import { watcherReportTemplate } from './report';
import { extractCharly, isReady } from '../extractors/simplifiedExtractors';
import Profiling from './profiling';
import { sendOrder } from '../../services/binance';
import { sendEmail } from '../../services/aws/sns';
import { POSTPONE_RETRIES, USDT_TO_BET } from '../../constants';

const handler = async (event: {}) => {
  const profiling = new Profiling();
  await isReady;
  profiling.log('Setup');
  const info = await binanceInspector(profiling);
  profiling.log('Fetch news');
  if (info == null) {
    console.debug(profiling.toString());
    return { message: 'Not new', profiling: profiling.toString(), event };
  }
  const actionAt = new Date();
  profiling.log('Update News');

  // We have a new news 🎉
  const symbols = extractCharly(info.title);
  profiling.log('Extractor');

  const promises = symbols.map(async symbol => {
    const response = await sendOrder('BUY', symbol, USDT_TO_BET);
    await insertTransaction(response.data);
    const message = {
      buyResponse: response.data,
      tries: POSTPONE_RETRIES,
    };
    await sendToSeller(message);
  });
  await Promise.all(promises);
  await updateLastNews(info.url);
  await insertPublication(info.url, info.title, actionAt.getTime(), symbols);
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

export default handler;
