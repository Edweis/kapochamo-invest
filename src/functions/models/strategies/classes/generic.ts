import { Tick } from '../../../../types';

export interface StrategyInterface extends Strategy {
  name: string;
  buy: (tick: Tick) => void;
  shouldSell: (tick: Tick) => boolean;
}

class Strategy extends Object {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

export default Strategy;
