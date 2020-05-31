export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const PUPPETTER_PARAMS = {
  headless: true,
};
