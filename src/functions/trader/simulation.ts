import { followerLst } from '../models/strategies/listeners';
import { StrategyInstance } from '../models/types';
import { listenTick } from './websocket';
import { sleep } from '../../helpers/common';
import { Tick } from '../../types';

const ABORT_AFTER_SEC = 60;
type TradingReport = { buy: Tick; sell: Tick; variation: number };
export const simulateBuyNow = async (
  symbol: string
): Promise<TradingReport> => {
  return new Promise((resolve, reject) => {
    // Reject after timeout
    sleep(ABORT_AFTER_SEC * 1000).then(reject);

    let strategyInstance: StrategyInstance;
    let tickBought: Tick;
    listenTick(symbol, (tick, ws) => {
      // BUY
      if (tickBought == null) {
        tickBought = tick;
        console.warn('-----BUYING----');
        console.warn(tickBought);
        strategyInstance = followerLst(tickBought, 0.0001);
      }

      // CHECK STRATEGY
      const shouldSell = strategyInstance(tick);
      const variation =
        (100 * (tick.close - tickBought.close)) / tickBought.close;
      console.log(tick.close, variation);

      // SELL
      if (shouldSell) {
        console.warn('-----SELLING----');
        console.warn(tick);
        console.warn('Earning: ', shouldSell);
        ws.close();
        const report = { buy: tickBought, sell: tick, variation };
        resolve(report);
      }
    });
  });
};
