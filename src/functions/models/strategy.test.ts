import { getPeakTicks, follower, charly } from './strategy';
import { Tick } from './types';

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

describe('getPeakTicks', () => {
  it('should work for raising serie', () => {
    const ticks = tickify([1, 2, 3]);
    expect(getPeakTicks(ticks)).toEqual([1, 2, 3]);
  });
  it('should work for falling serie', () => {
    const ticks = tickify([3, 2, 1]);
    expect(getPeakTicks(ticks)).toEqual([3, 3, 3]);
  });
  it('should work for varying serie', () => {
    const ticks = tickify([1, 2, 1, 3, 0, 1, 2, 4]);
    expect(getPeakTicks(ticks)).toEqual([1, 2, 2, 3, 3, 3, 3, 4]);
  });
});

describe('follower', () => {
  it('should return latest for raising serie', () => {
    const ticks = tickify([1, 2, 3, 4, 5]);
    expect(follower(0.5)(ticks)).toEqual(toTick(5));
    expect(follower(0.1)(ticks)).toEqual(toTick(5));
    expect(follower(0.01)(ticks)).toEqual(toTick(5));
  });
  it('should sell after 10% loss', () => {
    const ticks = tickify([100, 95, 90, 80, 75, 81]);
    expect(follower(0.1)(ticks)).toEqual(toTick(90));
  });
  it('should sell after a hill 10%', () => {
    const ticks = tickify([50, 60, 100, 95, 92, 90, 100]);
    expect(follower(0.1)(ticks)).toEqual(toTick(90));
  });
  it('should have the right name', () => {
    expect(follower(0.001).name).toEqual('follower0_1');
    expect(follower(0.05).name).toEqual('follower5');
    expect(follower(0.5).name).toEqual('follower50');
  });
});

describe('charly', () => {
  it('should return latest for raising serie', () => {
    const ticks = tickify([1, 2, 3, 4, 5]);
    expect(charly(0.5, 0)(ticks)).toEqual(toTick(5));
    expect(charly(0.1, 0)(ticks)).toEqual(toTick(5));
    expect(charly(0.01, 0)(ticks)).toEqual(toTick(5));
  });
  it('should sell after 5% loss', () => {
    const ticks = tickify([100, 99, 95, 84, 76]);
    expect(charly(0.1, 0)(ticks)).toEqual(toTick(95));
  });
  it('should sell after a hill 100% -> sell at -10%', () => {
    const ticks = tickify([50, 60, 100, 95, 92, 90, 100]);
    expect(charly(0.1, 0)(ticks)).toEqual(toTick(90));
  });
  it('should have the right name', () => {
    expect(charly(0.001, 1, 0.3).name).toEqual('charly_S0_1W1L30');
    expect(charly(0.05, 2, 0.2).name).toEqual('charly_S5W2L20');
    expect(charly(0.5, 3, 0.1).name).toEqual('charly_S50W3L10');
  });
});
