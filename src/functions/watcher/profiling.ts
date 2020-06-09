export type HRTime = [number, number];
type ProfilingReport = Array<{ name: string; hrtime: HRTime }>;

const displayTimeDiff = (name: string, start: HRTime, end: HRTime) => {
  const diff = end[1] - start[1];
  let nano = diff % 1000;
  let micro = ((diff - nano) / 1000) % 1000;
  let milli = (diff - micro * 1000 - nano) / 1000000;
  let sec = end[0] - start[0];

  if (nano < 0) {
    micro -= 1;
    nano = 1000 + nano;
  }
  if (micro < 0) {
    milli -= 1;
    micro = 1000 + micro;
  }
  if (milli < 0) {
    sec -= 1;
    milli = 1000 + milli;
  }
  let result = `${name.padEnd(20)}: `;
  result += `${sec.toString().padStart(3)}s `;
  result += `${milli.toString().padStart(3)}ms `;
  result += `${micro.toString().padStart(3)}μs `;
  result += `${nano.toString().padStart(3)}ns`;
  return result;
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
