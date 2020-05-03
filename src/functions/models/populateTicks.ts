import { BinanceInfo } from '../../types';
import { getAllAssets, getAllSymbolFromAsset } from './queries';
import { getAssetFromInfo } from './extract';
import { clearData, exportTicks } from './export';
import { getTickAround } from './getNewsContext';

export const getTicksAroundNews = async (info: BinanceInfo) => {
  if (info.time == null) throw Error("Can't evaluate a null date");
  const time = info.time;
  const allAssets = await getAllAssets();
  const assets = getAssetFromInfo(info, allAssets);
  const symbols = await getAllSymbolFromAsset(assets);
  await clearData();
  await Promise.all(
    symbols
      .filter(symbol => symbol.endsWith('USDT'))
      .map(async symbol => {
        const ticks = await getTickAround(new Date(time), symbol);
        if (ticks.length === 0) return; // No tick for that time and that currency
        await exportTicks(symbol, ticks);
      })
  );
};
