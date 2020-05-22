import Strategy, { StrategyInterface } from './generic';
import { checkPercentage } from './helpers';
import { Tick } from '../../types';

type Percentage = number;

class Follower extends Strategy implements StrategyInterface {
  private sellAfterLossOf: Percentage;

  private highest: number;

  constructor(sellAfterLossOf: Percentage) {
    super(`follower${sellAfterLossOf * 100}`);
    checkPercentage(sellAfterLossOf);
    this.sellAfterLossOf = sellAfterLossOf;
  }

  buy = (tick: Tick) => {
    this.highest = tick.close;
  };

  shouldSell = (tick: Tick) => {
    this.highest = Math.max(this.highest, tick.close);
    return tick.close <= this.highest * (1 - this.sellAfterLossOf);
  };
}

export default Follower;
