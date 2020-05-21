import { followerLst } from '../strategies/listeners';
import { StrategyInstance } from '../types';
import { listenTick } from './websocket';
import { sleep } from '../../helpers/common';
import { Tick } from '../../types';

const ABORT_AFTER_SEC = 14 * 60;
type TradingReport = { buy: Tick; sell: Tick; variation: number };
const buyTick = (tick: Tick) => {
  console.warn('-----BUYING----');
  console.warn(tick);
  return tick;
};

const sellTick = (tick: Tick) => {
  console.warn('-----SELLING----');
  console.warn(tick);
};

export const simulateBuyNow = async (
  symbol: string
): Promise<TradingReport> => {
  return new Promise((resolve, reject) => {
    // Reject after timeout
    sleep(ABORT_AFTER_SEC * 1000).then(() => {
      // TODOOOOO SELL TICK AND TERMINATE IN TIMEOUT : CLASSIFY STRATEGY ?
      reject(new Error('Manual timeout exceeded'));
    });

    let strategyInstance: StrategyInstance;
    let tickBought: Tick;
    listenTick(symbol, (tick, ws) => {
      // BUY
      if (tickBought == null) {
        tickBought = buyTick(tick);
        strategyInstance = followerLst(tickBought, 0.05);
      }

      // CHECK STRATEGY
      const shouldSell = strategyInstance(tick);
      const variation =
        (100 * (tick.close - tickBought.close)) / tickBought.close;
      console.log(tick.close, variation);

      // SELL
      if (shouldSell) {
        sellTick(tick);
        console.warn('Earning: ', variation);
        ws.close();
        const report = { buy: tickBought, sell: tick, variation };
        resolve(report);
      }
    });
  });
};
