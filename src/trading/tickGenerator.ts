import { Moment } from 'moment-timezone';

type IteratedValue<U> = {
  id: number;
  value: U;
  nextId: number | null;
  prevId: number | null;
};
export default class TickGenerator<T> {
  symbol: string;
  cache: { [key: string]: T } = {};
  startId: number;
  endId: number;

  constructor(symbol = 'BTC/USDT', startId: number, endId: number) {
    this.symbol = symbol;
    this.startId = startId;
    this.endId = endId;
  }

  getFirstValues(numberTick: number) {
    const list: IteratedValue<T>[] = [];
    let unix = this.startId;
    for (let i = 0; i < numberTick; i++) {
      const output = this.getValueAt(unix);
      if (output.nextId == null) throw Error('Maximum output exceeded.');
      list.push(output);
      unix = output.nextId;
    }
    return list;
  }

  getValueAt(unix: number): IteratedValue<T> {
    throw Error('Not implemented for ' + unix);
  }

  *getListUntil(unix: number, numberTick: number) {
    const list: IteratedValue<T>[] = [];
    for (let i = 0; i < numberTick; i++) {
      const output = this.getValueAt(unix);
      if (output.prevId == null) throw Error('Maximum output exceeded.');
      list.push(output);
      unix = output.prevId;
    }
    list.reverse();
    yield list;
    const nextId = list[numberTick - 1].nextId;
    if (nextId == null) return null;
    const nextTick = this.getValueAt(nextId);
    const nextList = list.slice(1).concat(nextTick);
    yield nextList;
  }

  *generateFrom(startDate: Moment, memory = 1) {
    const tickGenerator = this.getListUntil(startDate.unix(), memory);
    let generated = tickGenerator.next();
    while (generated.done) {
      yield generated.value;
      generated = tickGenerator.next();
    }
    return null;
  }
}
