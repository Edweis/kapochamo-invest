import Strategy from './generic';
import { checkPercentage } from './helpers';
import { Tick } from '../../types';

type Percentage = number;

class RelativeFollower extends Strategy {
  private sellAfterRelativeLossOf: Percentage;

  private pureLossAppetite: Percentage;

  private boughtFor: number;

  private highest: number;

  constructor(
    sellAfterRelativeLossOf: Percentage,
    pureLossAppetite: Percentage = 0.2
  ) {
    super(
      `relativeFollower_L${pureLossAppetite * 100}_S${sellAfterRelativeLossOf *
        100}`
    );
    checkPercentage(sellAfterRelativeLossOf);
    checkPercentage(pureLossAppetite);
    this.sellAfterRelativeLossOf = sellAfterRelativeLossOf;
    this.pureLossAppetite = pureLossAppetite;
  }

  init = (tick: Tick) => {
    this.highest = tick.close;
    this.boughtFor = tick.close;
  };

  shouldSell = (tick: Tick) => {
    this.highest = Math.max(this.highest, tick.close);
    const gain = Math.max((tick.close - this.boughtFor) / this.boughtFor, 0);
    const triggerCoef =
      gain === 0
        ? 1 - this.pureLossAppetite
        : 1 - gain * this.sellAfterRelativeLossOf;
    return tick.close <= this.highest * triggerCoef;
  };
}

export default RelativeFollower;
