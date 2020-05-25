import { Tick } from '../../types';
import Order from '../order';

class Strategy extends Object {
  name: string;

  didBuy = false;

  shouldSell: (tick: Tick) => boolean;

  init: (tick: Tick) => void;

  order: Order | null = null;

  constructor(name: string) {
    super();
    this.name = name;
  }

  toString() {
    return this.name;
  }

  setOrder = (order: Order) => {
    this.order = order;
  };

  buy = (tick: Tick) => {
    this.didBuy = true;
    if (this.init != null) this.init(tick); // SHOULD USE WHAT COMES FROM ORDER, NOT TICK
    if (this.order != null) return this.order.buy();
    return Promise.resolve(); // We can't use async func class property. This is a trick
  };

  getVariation = (tick?: Tick) => this.order?.getVariation(tick?.close) || null;

  sell = () => {
    if (this.order != null) return this.order.sell();
    return Promise.resolve(); // We can't use async func class property. This is a trick
  };
}

export default Strategy;
