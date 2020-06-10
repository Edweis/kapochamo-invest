import Follower from './follower';
import { listenTick } from './websocket';
import { sleep } from '../../helpers/common';

const TIMEOUT = 14 * 60; // 14 minutes

const waitToSell = async (strategy: Follower, symbol: string) =>
  Promise.race([
    sleep(TIMEOUT * 1000),
    listenTick(symbol, async (tick, done) => {
      if (strategy.shouldSell(tick)) done();
    }),
  ]) as Promise<void>;

export default waitToSell;
