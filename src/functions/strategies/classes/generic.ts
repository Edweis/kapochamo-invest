import { Tick } from '../../../types';

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

// TODOOOO IMPLEMENT VARIATION, stopTrading(). GENRIC SHOULD BE AWARE OF BUYING TICK
// IT CAN ALSO COMPUTE VARIATION ON SELL, TAKING FEES INTO ACCOUNT
// ALSO CHECH THAT BUY HAPPENED BEFORE SELL
export default Strategy;
