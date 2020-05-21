import Strategy, { StrategyInterface } from './generic';
import { Tick } from '../../../../types';

class WaitFor extends Strategy implements StrategyInterface {
  private waitFor: number;

  private endAt: number;

  constructor(waitFor: number) {
    super(`waitFor${waitFor}`);
    this.waitFor = waitFor;
  }

  buy = (tick: Tick) => {
    this.endAt = tick.openTime + this.waitFor * 60 * 1000;
  };

  shouldSell = (tick: Tick) => {
    return tick.openTime >= this.endAt;
  };
}

export default WaitFor;
