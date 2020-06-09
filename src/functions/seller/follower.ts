import { Tick } from '../../types';

const checkPercentage = (num: number) => {
  if (num > 1 || num < 0) throw Error(`${num} should be a percentage`);
};

class Follower {
  private sellAfterLossOf: number;

  private highest: number;

  constructor(sellAfterLossOf: number) {
    checkPercentage(sellAfterLossOf);
    this.sellAfterLossOf = sellAfterLossOf;
  }

  init = (price: number) => {
    this.highest = price;
  };

  shouldSell = (tick: Tick) => {
    this.highest = Math.max(this.highest, tick.close);
    return tick.close <= this.highest * (1 - this.sellAfterLossOf);
  };
}

export default Follower;
