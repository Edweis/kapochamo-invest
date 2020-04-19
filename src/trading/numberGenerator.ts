import TickGenerator from './tickGenerator';
import moment from 'moment-timezone';

const NOW = '2020-04-11T11:14:41.881Z';
const END_TIME = moment(NOW);
const START_TIME = moment(NOW).subtract(1, 'y');
const TICK_LAPSE_MS = 400;

export class NumberGenerator extends TickGenerator<number> {
  constructor(name: string) {
    super(name, START_TIME.unix(), END_TIME.unix());
  }

  getValueAt(unix: number) {
    if (unix % TICK_LAPSE_MS !== 0) new Error("Can't find tick at " + unix);
    const nextId = unix + TICK_LAPSE_MS;
    const prevId = unix - TICK_LAPSE_MS;
    const value = unix - START_TIME.unix();
    return {
      id: unix,
      value,
      nextId: nextId > this.endId ? null : nextId,
      prevId: prevId < this.startId ? null : prevId,
    };
  }
}
