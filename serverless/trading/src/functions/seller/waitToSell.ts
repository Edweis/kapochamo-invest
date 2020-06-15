import Follower from './follower';
import { listenTick } from './websocket';
import { sleep } from '../../helpers/common';

export enum RACE_ACTION {
  POSTPONE,
  SELL,
}

export const waitTimeout = (timeout: number) =>
  sleep(timeout * 1000).then(() => RACE_ACTION.POSTPONE);

export const waitToSell = async (strategy: Follower, symbol: string) =>
  listenTick(symbol, async (tick, done) => {
    if (strategy.shouldSell(tick)) done();
  }).then(() => RACE_ACTION.SELL);
