import Profiling, { HRTime } from './profiling';

const start = [85746, 648283] as HRTime;
describe('computeProfiling', () => {
  it('should work for 2 simple times', () => {
    const exec1 = [123, 456789111];
    const exec2 = [987, 654321222];
    const batmanTime = [start[0] + exec1[0], start[1] + exec1[1]] as HRTime;
    const robinTime = [
      batmanTime[0] + exec2[0],
      batmanTime[1] + exec2[1],
    ] as HRTime;
    const prof = new Profiling();
    prof.start = start;
    prof.report.push({ name: 'batman', hrtime: batmanTime });
    prof.report.push({ name: 'robin', hrtime: robinTime });
    expect(prof.toString()).toEqual(
      'batman              : 123s 456ms 789μs 111ns\nrobin               : 987s 654ms 321μs 222ns'
    );
  });
});
