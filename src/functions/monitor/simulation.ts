import { followerLst } from '../models/strategies/listeners';
import { StrategyInstance } from '../models/types';
import { listenTick } from './websocket';
import { Tick } from '../../types';

export const simulateBuyNow = (symbol: string) => {
  let strategyInstance: StrategyInstance;
  let tickBought: Tick;
  listenTick(symbol, (tick, ws) => {
    if (tickBought == null) {
      tickBought = tick;
      console.warn('-----BUYING----');
      console.warn(tickBought);
      strategyInstance = followerLst(tickBought, 0.0001);
    }
    const shouldSell = strategyInstance(tick);
    const variation =
      (100 * (tick.close - tickBought.close)) / tickBought.close;
    if (shouldSell) {
      console.warn('-----SELLING----');
      console.warn(tick);
      console.warn('Earning: ', shouldSell);
      ws.close();
    } else {
      console.log(tick.close, variation);
    }
  });
};

simulateBuyNow('BTCUSDT');
