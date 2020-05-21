import { BinanceInfo } from '../../types';
import { clearData, exportTicks, savePerformance } from './export';
import { getTickAround } from '../getNewsContext';
import { onlyBnb } from '../extractors';
import { Strategy, Extractor } from '../types';
import { computePerformance } from './compute';

export const getPerformanceForNews = async (
  info: BinanceInfo,
  strategy: Strategy,
  extractor: Extractor = onlyBnb,
  shouldExport = { file: false, database: false }
) => {
  if (info.time == null) throw Error("Can't evaluate a null date");
  const { time } = info;
  const symbols = await extractor(info);
  if (symbols.length > 20) {
    throw Error(`To many symbols (${symbols.length}) for ${info.title}`);
  }
  if (shouldExport.file) await clearData();
  const performances: { [symbol: string]: number | null } = {};
  await Promise.all(
    symbols.map(async symbol => {
      const datetime = new Date(time);
      const ticks = await getTickAround(datetime, symbol);
      if (shouldExport.file) await exportTicks(symbol, ticks);
      const performance = computePerformance(strategy, ticks, datetime);
      if (shouldExport.database)
        await savePerformance(
          info,
          strategy.name,
          symbol,
          extractor.name,
          performance
        );
      performances[symbol] = performance;
    })
  );

  return performances;
};
