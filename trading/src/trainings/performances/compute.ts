import moment from 'moment';
import _ from 'lodash';
import { Tick } from '../../types';
import { Strategy, Highest } from '../../functions/strategies';

const binanceFees = {
  'VIP 0': 0.001,
  'VIP 1': 0.0009,
  'VIP 2': 0.0008,
  'VIP 3': 0.0007,
  'VIP 4': 0.0007,
  'VIP 5': 0.0006,
  'VIP 6': 0.0005,
  'VIP 7': 0.0004,
  'VIP 8': 0.0003,
  'VIP 9': 0.0002,
};
const fees = binanceFees['VIP 0'];

const SHOULD_DISPLAY_PERFORMANCE = false;
const TICK_TIMEOUT = 20;
const toUnix = (date: Date) => moment(date).unix() * 1000;
export const computePerformance = (
  strategy: Strategy,
  ticks: Tick[],
  datetime: Date
) => {
  const now = toUnix(datetime);
  const futurTicks = ticks.filter(tick => tick.openTime >= now);
  if (futurTicks.length === 0) return null;

  strategy.buy(futurTicks[0]);
  if (strategy instanceof Highest) strategy.feedHistory(futurTicks);
  let sellTick = futurTicks.find(tick => strategy.shouldSell(tick));

  if (sellTick == null)
    sellTick = futurTicks[TICK_TIMEOUT] || _.last(futurTicks);

  // check tick exists; FIXE IS THAT NEEDED ?
  const allTimes = futurTicks.map(tick => tick.openTime);
  if (!allTimes.includes(sellTick.openTime))
    throw Error(
      `Strategy yield a non existing tick ${sellTick.openTime} ${strategy.name}`
    );

  // display stats
  const sellFor = sellTick.close;
  const valueNow = futurTicks[0].open;
  if (SHOULD_DISPLAY_PERFORMANCE) {
    const sellAt = moment(sellTick.openTime).toDate();
    console.debug(strategy.name, { valueNow, sellFor, sellAt, now });
  }

  // return yield SHOULD BE IN STRATEGY
  const rawYield = (sellFor - valueNow) / sellFor;
  return 100 * (rawYield - 2 * fees);
};
