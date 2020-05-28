import { Strategy } from '../strategies';
import { listenTick } from './websocket';
import { sleep } from '../../helpers/common';

const ABORT_AFTER_SEC = 14 * 60;
type TradingReport = { variation: number | null };

export const simulateBuyNow = async (
  strategy: Strategy
): Promise<TradingReport> => {
  if (strategy.order == null) throw new Error('Order has no symbol');
  const { symbol } = strategy.order;
  console.warn(`Strart trade of ${strategy.name} for ${symbol}`);

  return new Promise(resolve => {
    // Reject after timeout
    sleep(ABORT_AFTER_SEC * 1000).then(async () => {
      await strategy.sell();
      resolve();
    });

    listenTick<TradingReport>(symbol, async (tick, resolveWs) => {
      // BUY
      if (!strategy.didBuy) strategy.buy(tick); // note that we don't wait to buy

      const variation = strategy.getVariation(tick);
      console.log(tick.close, variation);

      // SELL
      if (strategy.shouldSell(tick)) {
        await strategy.sell();
        const report = { variation: strategy.getVariation() };
        resolveWs(report);
      }
    }).then(resolve);
  });
};
