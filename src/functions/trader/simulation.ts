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

  return new Promise((resolve, reject) => {
    // Reject after timeout
    sleep(ABORT_AFTER_SEC * 1000).then(async () => {
      await strategy.sell();
      reject(new Error('Manual timeout exceeded'));
    });

    listenTick<TradingReport>(symbol, async (tick, ws, resolveWs) => {
      // BUY
      if (!strategy.didBuy) strategy.buy(tick); // note that we don't wait to buy

      const variation = strategy.getVariation(tick);
      console.log(tick.close, variation);

      // SELL
      if (strategy.shouldSell(tick)) {
        await strategy.sell();
        ws.close();
        const report = { variation: strategy.getVariation() };
        resolveWs(report);
      }
    }).then(resolve);
  });
};
