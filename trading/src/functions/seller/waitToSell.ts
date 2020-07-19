import Follower from './follower';
import { listenTick } from './websocket';
import { sleep } from '../../helpers/common';
import { TIMEOUT } from '../../constants';

export enum RACE_ACTION {
  POSTPONE,
  SELL,
}

const waitTimeout = async (timeout: number) =>
  sleep(timeout * 1000).then(() => RACE_ACTION.POSTPONE);

const waitToSell = async (strategy: Follower, symbol: string) =>
  listenTick(symbol, async (tick, done) => {
    if (strategy.shouldSell(tick)) done();
  }).then(() => RACE_ACTION.SELL);

export const waitForAction = async (
  strategy: Follower,
  symbol: string
): Promise<RACE_ACTION> =>
  Promise.race([waitTimeout(TIMEOUT), waitToSell(strategy, symbol)]);
