import {
  followerLst,
  waitLst,
  relativeFollower,
  convertSync,
} from './listeners';
import { Tick } from '../../types';

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

const timeTicks = (ticks: Tick[]) =>
  ticks.map((tick, index) => ({ ...tick, openTime: index * 60 * 1000 }));

describe('follower', () => {
  it('should return latest for raising serie', () => {
    const ticks = tickify([1, 2, 3, 4, 5]);
    expect(convertSync(followerLst, [0.5])(ticks)).toEqual(toTick(5));
    expect(convertSync(followerLst, [0.1])(ticks)).toEqual(toTick(5));
    expect(convertSync(followerLst, [0.01])(ticks)).toEqual(toTick(5));
  });
  it('should sell after 10% loss', () => {
    const ticks = tickify([100, 95, 90, 80, 75, 81]);
    expect(convertSync(followerLst, [0.1])(ticks)).toEqual(toTick(90));
  });
  it('should sell after a hill 10%', () => {
    const ticks = tickify([50, 60, 100, 95, 92, 90, 100]);
    expect(convertSync(followerLst, [0.1])(ticks)).toEqual(toTick(90));
  });
  it('should have the right name', () => {
    const someTick = toTick(1);
    expect(followerLst(someTick, 0.001).name).toEqual('follower0_1');
    expect(followerLst(someTick, 0.05).name).toEqual('follower5');
    expect(followerLst(someTick, 0.5).name).toEqual('follower50');
  });
});

describe('waitLst', () => {
  it('should wait well', () => {
    const ticks = timeTicks(tickify([0, 1, 2, 3, 4]));
    const wait0 = convertSync(waitLst, [0]);
    const wait3 = convertSync(waitLst, [3]);
    expect(wait0(ticks)?.volume).toEqual(0);
    expect(wait3(ticks)?.volume).toEqual(3);
  });
});

describe('relativeFollower', () => {
  it('should return latest for raising serie', () => {
    const ticks = tickify([1, 2, 3, 4, 5]);
    const follower50 = convertSync(relativeFollower, [0.5, 0.2]);
    const follower10 = convertSync(relativeFollower, [0.1, 0.2]);
    const follower1 = convertSync(relativeFollower, [0.01, 0.2]);
    expect(follower50(ticks)).toEqual(toTick(5));
    expect(follower10(ticks)).toEqual(toTick(5));
    expect(follower1(ticks)).toEqual(toTick(5));
  });
  it('should sell after 5% loss', () => {
    const ticks = tickify([100, 99, 95, 84, 76]);
    const follower10 = convertSync(relativeFollower, [0.1, 0.05]);
    expect(follower10(ticks)).toEqual(toTick(95));
  });
  it('should sell after a hill 100% -> sell at -10%', () => {
    const ticks = tickify([50, 60, 100, 95, 92, 90, 100]);
    const follower10 = convertSync(relativeFollower, [0.1, 0.05]);
    expect(follower10(ticks)).toEqual(toTick(90));
  });
  it('should have the right name', () => {
    const someTick = toTick(1);
    const follower50 = relativeFollower(someTick, 0.5, 0.2);
    const follower10 = relativeFollower(someTick, 0.1, 0.1);
    const follower1 = relativeFollower(someTick, 0.001, 0.08);
    expect(follower50.name).toEqual('relativeFollower_L20_S50');
    expect(follower10.name).toEqual('relativeFollower_L10_S10');
    expect(follower1.name).toEqual('relativeFollower_L8_S0_1');
  });
});
