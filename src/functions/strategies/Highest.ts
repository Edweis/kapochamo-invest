import Strategy, { StrategyInterface } from './generic';
import { Tick } from '../../types';

const HISTORY_ERROR_MESSAGE =
  'Highest Strategy did not have history. Make sure to use feedHistory before';
class Highest extends Strategy implements StrategyInterface {
  private highest: number;

  private hasHistory = false;

  constructor() {
    super(`highest`);
  }

  init = (tick: Tick) => {
    this.highest = tick.close;
  };

  feedHistory = (ticks: Tick[]) => {
    this.hasHistory = true;
    this.highest = ticks
      .map(tick => tick.close)
      .reduce((acc, val) => Math.max(acc, val), this.highest);
  };

  shouldSell = (tick: Tick) => {
    if (!this.hasHistory) throw Error(HISTORY_ERROR_MESSAGE);
    return tick.close - this.highest === 0; // tick.close are string
  };
}

export default Highest;
