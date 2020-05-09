import { charly } from './static';
import { followerLst, waitLst, relativeFollower } from './listeners';
import { Tick } from '../types';
import _ from 'lodash';

const toTick = (num: number): Tick => ({
  openTime: num,
  open: num,
  high: num,
  low: num,
  close: num,
  volume: num,
  closeTime: num,
  quoteAssetVolume: num,
  numberOfTrades: num,
  takerBuyBaseAssetVolume: num,
  takerBuyQuoteAssetVolume: num,
  ignore: num,
});
const tickify = (nums: number[]): Tick[] => nums.map(toTick);

const testListener = (strategy: (tick: Tick) => boolean, events: Tick[]) =>
  events.find(strategy) || _.last(events);

const timeTicks = (ticks: Tick[]) =>
  ticks.map((tick, index) => ({ ...tick, openTime: index * 60 * 1000 }));

describe('follower', () => {
  it('should return latest for raising serie', () => {
    const ticks = tickify([1, 2, 3, 4, 5]);
    const initialTick = toTick(1);
    const follower5 = followerLst(initialTick, 0.5);
    const follower10 = followerLst(initialTick, 0.1);
    const follower1 = followerLst(initialTick, 0.01);
    expect(testListener(follower5, ticks)).toEqual(toTick(5));
    expect(testListener(follower10, ticks)).toEqual(toTick(5));
    expect(testListener(follower1, ticks)).toEqual(toTick(5));
  });
  it('should sell after 10% loss', () => {
    const initialTick = toTick(100);
    const follower10 = followerLst(initialTick, 0.1);
    const ticks = tickify([95, 90, 80, 75, 81]);
    expect(testListener(follower10, ticks)).toEqual(toTick(90));
  });
  it('should sell after a hill 10%', () => {
    const initialTick = toTick(50);
    const follower10 = followerLst(initialTick, 0.1);
    const ticks = tickify([60, 100, 95, 92, 90, 100]);
    expect(testListener(follower10, ticks)).toEqual(toTick(90));
  });
  it('should have the right name', () => {
    const initialTick = toTick(100);
    expect(followerLst(initialTick, 0.001).name).toEqual('follower0_1');
    expect(followerLst(initialTick, 0.05).name).toEqual('follower5');
    expect(followerLst(initialTick, 0.5).name).toEqual('follower50');
  });
});

describe('waitLst', () => {
  it('should wait well', () => {
    const initialTick = toTick(-1);
    const ticks = timeTicks(tickify([0, 1, 2, 3, 4]));
    const wait0 = waitLst(initialTick, 0);
    const wait3 = waitLst(initialTick, 3);
    expect(testListener(wait0, ticks)?.volume).toEqual(0);
    expect(testListener(wait3, ticks)?.volume).toEqual(3);
  });
});

describe('relativeFollower', () => {
  it('should return latest for raising serie', () => {
    const initialTick = toTick(1);
    const ticks = tickify([2, 3, 4, 5]);
    const follower50 = relativeFollower(initialTick, 0.5, 0.2);
    const follower10 = relativeFollower(initialTick, 0.1, 0.2);
    const follower1 = relativeFollower(initialTick, 0.01, 0.2);
    expect(testListener(follower1, ticks)).toEqual(toTick(5));
    expect(testListener(follower10, ticks)).toEqual(toTick(5));
    expect(testListener(follower50, ticks)).toEqual(toTick(5));
  });
  it('should sell after 5% loss', () => {
    const ticks = tickify([99, 95, 84, 76]);
    const initialTick = toTick(100);
    const follower10 = relativeFollower(initialTick, 0.1, 0.05);
    expect(testListener(follower10, ticks)).toEqual(toTick(95));
  });
  it('should sell after a hill 100% -> sell at -10%', () => {
    const ticks = tickify([60, 100, 95, 92, 90, 100]);
    const initialTick = toTick(50);
    const follower10 = relativeFollower(initialTick, 0.1, 0.05);
    expect(testListener(follower10, ticks)).toEqual(toTick(90));
  });
  it('should have the right name', () => {
    const initialTick = toTick(100);
    const follower50 = relativeFollower(initialTick, 0.5, 0.2);
    const follower10 = relativeFollower(initialTick, 0.1, 0.1);
    const follower1 = relativeFollower(initialTick, 0.001, 0.08);
    expect(follower50.name).toEqual('relativeFollower_L20_S50');
    expect(follower10.name).toEqual('relativeFollower_L10_S10');
    expect(follower1.name).toEqual('relativeFollower_L8_S0_1');
  });
});
