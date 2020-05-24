import { StrategyInterface } from '../strategies';
import { listenTick } from './websocket';
import { sleep } from '../../helpers/common';
import { Tick } from '../../types';
import Order from '../order';

const ABORT_AFTER_SEC = 14 * 60;
type TradingReport = { buy: Tick; sell: Tick; variation: number };

export const simulateBuyNow = async (
  strategy: StrategyInterface,
  symbol: string
): Promise<TradingReport> => {
  return new Promise((resolve, reject) => {
    strategy.setOrder(new Order(symbol, 0.01));

    // Reject after timeout
    sleep(ABORT_AFTER_SEC * 1000).then(() => {
      // TODOOOOO SELL TICK AND TERMINATE IN TIMEOUT : CLASSIFY STRATEGY ?
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
        strategy.sell(tick);
        ws.close();
        const report = { buy: tickBought, sell: tick, variation };
        resolve(report);
      }
    });
  });
};
