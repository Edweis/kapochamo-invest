import { BinanceInfo } from '../../types';
import { clearData, exportTicks, savePerformance } from './export';
import { getTickAround } from '../getNewsContext';
import { onlyBnb } from '../../functions/extractors';
import { Extractor } from '../types';
import { Strategy } from '../../functions/strategies';
import { computePerformance } from './compute';

export const getPerformanceForNews = async (
  info: BinanceInfo,
  strategy: Strategy,
  extractor: Extractor = onlyBnb,
  shouldExport = { file: false, database: false }
) => {
  const time = await info.getTime();
  const symbols = await extractor(info);
  if (symbols.length > 30) {
    throw Error(`To many symbols (${symbols.length}) for ${info.title}`);
  }
  if (shouldExport.file) await clearData();
  const performances: { [symbol: string]: number | null } = {};
  await Promise.all(
    symbols.map(async symbol => {
      const ticks = await getTickAround(time, symbol);
      if (shouldExport.file) await exportTicks(symbol, ticks);
      const performance = computePerformance(strategy, ticks, time);
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
