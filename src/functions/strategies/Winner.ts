import Strategy from './generic';
import Follower from './Follower';
import { checkPercentage } from './helpers';
import { Tick } from '../../types';

type Percentage = number;

class Winner extends Strategy {
  follower: Follower;

  winOf: number;

  boughtAt: number;

  constructor(winOf: Percentage, sellAfterLossOf: Percentage) {
    super(`Winner${winOf}_L${sellAfterLossOf * 100}`);
    checkPercentage(winOf);
    this.winOf = winOf;
    this.follower = new Follower(sellAfterLossOf);
  }

  init = (tick: Tick) => {
    this.boughtAt = tick.close;
    this.follower.init(tick);
  };

  shouldSell = (tick: Tick) => {
    const shouldSell =
      (tick.close - this.boughtAt) / this.boughtAt >= this.winOf;
    console.debug('Winner', {
      var: (100 * (tick.close - this.boughtAt)) / this.boughtAt,
      threshold: 100 * this.winOf,
    });
    const willFollowerSell = this.follower.shouldSell(tick);
    return willFollowerSell || shouldSell;
  };
}

export default Winner;
