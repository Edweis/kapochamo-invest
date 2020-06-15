import { Tick } from '../../types';

const checkPercentage = (num: number) => {
  if (num > 1 || num < 0) throw Error(`${num} should be a percentage`);
};

class Follower {
  private sellAfterLossOf: number;

  highest: number;

  constructor(sellAfterLossOf: number) {
    checkPercentage(sellAfterLossOf);
    this.sellAfterLossOf = sellAfterLossOf;
  }

  shouldSell = (tick: Tick) => {
    this.highest = Math.max(this.highest || 0, tick.close);
    return tick.close <= this.highest * (1 - this.sellAfterLossOf);
  };
}

export default Follower;
