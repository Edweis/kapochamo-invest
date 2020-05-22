export const checkPercentage = (num: number) => {
  if (num > 1 || num < 0) throw Error(`${num} should be a percentage`);
};
