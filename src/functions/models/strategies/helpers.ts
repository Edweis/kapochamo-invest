export const checkPercentage = (num: number) => {
  if (num > 1 || num < 0) throw Error(`${num} should be a percentage`);
};

export const rename = <T extends Function>(fn: T, name: string): T => {
  const formatedName = name.replace('.', '_');
  // eslint-disable-next-line
  return new Function(
    'fn',
    `return (function ${formatedName}(){\n  return fn.apply(this, arguments)\n});`
  )(fn);
};
