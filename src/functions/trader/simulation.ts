import { Strategy } from '../strategies';
import { listenTick } from './websocket';
import { sleep } from '../../helpers/common';
import { Tick } from '../../types';

const ABORT_AFTER_SEC = 14 * 60;
type TradingReport = { buy: Tick; sell: Tick; variation: number | null };

export const simulateBuyNow = async (
  strategy: Strategy
): Promise<TradingReport> => {
  return new Promise((resolve, reject) => {
    if (strategy.order == null) throw new Error('Order has no symbol');
    const { symbol } = strategy.order;
    console.warn(`Strart trade of ${strategy.name} for ${symbol}`);

    // Reject after timeout
    sleep(ABORT_AFTER_SEC * 1000).then(() => {
      strategy.sell();
      reject(new Error('Manual timeout exceeded'));
    });

    let tickBought: Tick;
    listenTick(symbol, (tick, ws) => {
      // BUY
      if (!strategy.didBuy) strategy.buy(tick);

      const variation = strategy.getVariation(tick);
      console.log(tick.close, variation);

      // SELL
      if (strategy.shouldSell(tick)) {
        strategy.sell();
        ws.close();
        const report = { buy: tickBought, sell: tick, variation };
        resolve(report);
      }
    });
  });
};
