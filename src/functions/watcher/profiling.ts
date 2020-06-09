export type HRTime = [number, number];
type ProfilingReport = Array<{ name: string; hrtime: HRTime }>;

const displayTimeDiff = (name: string, start: HRTime, end: HRTime) => {
  const diff = end[1] - start[1];
  const nano = diff % 1000;
  const micro = ((diff - nano) / 1000) % 1000;
  const milli = (diff - micro * 1000 - nano) / 1000000;
  const sec = end[0] - start[0];
  return `${name.padEnd(20)}: ${sec}s ${milli}ms ${micro}μs ${nano}ns`;
};
class Profiling {
  start: HRTime;

  report: ProfilingReport = [];

  constructor() {
    this.start = process.hrtime();
  }

  log = (name: string) => {
    const hrtime = process.hrtime();
    this.report.push({ name, hrtime });
  };

  toString = () =>
    this.report
      .map((value, index, array) => {
        const compareWith = index === 0 ? this.start : array[index - 1].hrtime;
        return displayTimeDiff(value.name, compareWith, value.hrtime);
      })
      .join('\n');

  getTotal = () =>
    displayTimeDiff(
      'Total',
      this.start,
      this.report[this.report.length - 1].hrtime
    );
}

export default Profiling;
