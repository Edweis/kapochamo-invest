import { OrderPostFullResponse } from '../services/types';

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const PUPPETTER_PARAMS = {
  headless: true,
};

export const computePrice = (response: OrderPostFullResponse) =>
  response.fills
    .map(fill => Number(fill.price) * Number(fill.qty))
    .reduce((acc, value) => acc + value, 0) / response.origQty;
