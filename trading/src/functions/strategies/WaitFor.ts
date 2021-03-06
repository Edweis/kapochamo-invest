import Strategy from './generic';
import { Tick } from '../../types';

class WaitFor extends Strategy {
  private waitFor: number;

  private endAt: number;

  constructor(waitFor: number) {
    super(`waitFor${waitFor}`);
    this.waitFor = waitFor;
  }

  init = (tick: Tick) => {
    this.endAt = tick.openTime + this.waitFor * 60 * 1000; // minute
  };

  shouldSell = (tick: Tick) => {
    return tick.openTime >= this.endAt;
  };
}

export default WaitFor;
