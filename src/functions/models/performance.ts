import { BinanceInfo } from '../../types';
import { clearData, exportTicks, savePerformance } from './export';
import { getTickAround } from './getNewsContext';
import moment from 'moment';
import { Tick, Strategy, Extractor } from './types';

const SHOULD_DISPLAY_PERFORMANCE = false;
const toUnix = (date: Date) => moment(date).unix() * 1000;
export const computePerformance = (
  strategy: Strategy,
  ticks: Tick[],
  datetime: Date
) => {
  const now = toUnix(datetime);
  const futurTicks = ticks.filter(tick => tick.openTime >= now);
  if (futurTicks.length === 0) return null;

  const sellTick = strategy(futurTicks);

  if (sellTick == null) return null;

  // check tick exists
  const allTimes = futurTicks.map(tick => tick.openTime);
  if (!allTimes.includes(sellTick.openTime))
    throw Error('Strategy yield a non existing tick');

  // display stats
  const sellFor = sellTick.close;
  const sellAt = moment(sellTick.openTime).toDate();
  const valueNow = futurTicks[0].close;
  if (SHOULD_DISPLAY_PERFORMANCE)
    console.debug(strategy.name, { valueNow, sellFor, sellAt, now });

  // return yield
  return (100 * (sellFor - valueNow)) / sellFor;
};

export const getPerformanceForNews = async (
  info: BinanceInfo,
  strategy: Strategy,
  extractor: Extractor,
  shouldExport = { file: false, database: false }
) => {
  if (info.time == null) throw Error("Can't evaluate a null date");
  const time = info.time;
  const symbols = await extractor(info);
  if (symbols.length > 10) {
    throw Error('To many symbols (' + symbols.length + ') for ' + info.title);
  }
  if (!symbols.includes('BNBUSDT')) symbols.push('BNBUSDT');
  if (shouldExport.file) await clearData();
  const performances: { [symbol: string]: number | null } = {};
  await Promise.all(
    symbols.map(async symbol => {
      const datetime = new Date(time);
      const ticks = await getTickAround(datetime, symbol);
      if (shouldExport.file) await exportTicks(symbol, ticks);
      const performance = computePerformance(strategy, ticks, datetime);
      if (shouldExport.database)
        await savePerformance(info, strategy.name, symbol, performance);
      performances[symbol] = performance;
    })
  );

  return performances;
};
