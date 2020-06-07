export type HRTime = [number, number];
type ProfilingReport = Array<{ name: string; hrtime: HRTime }>;
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
        const diff = value.hrtime[1] - compareWith[1];
        const nano = diff % 1000;
        const micro = ((diff - nano) / 1000) % 1000;
        const milli = (diff - micro * 1000 - nano) / 1000000;
        const sec = value.hrtime[0] - compareWith[0];
        return `${value.name}: ${sec}s ${milli}ms ${micro}μs ${nano}ns`;
      })
      .join('\n');
}

export default Profiling;
