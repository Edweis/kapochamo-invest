import _ from 'lodash';
import fs from 'fs';
import { Tick } from './types';
import { BinanceInfo } from '../../types';
import pg from '../../services/postgres';

export const clearData = async () => {
  const files = await fs.promises.readdir('./data/');
  await Promise.all(
    files.map(async file => fs.promises.unlink('./data/' + file))
  );
};
export const exportTicks = async (symbol: string, ticks: Tick[]) => {
  if (ticks.length === 0) return; //Nothing to import
  const headers = _.keys(ticks[0]) as Array<keyof Tick>;
  const data = ticks
    .map(tick => headers.map(key => tick[key]).join(','))
    .join('\n');
  await fs.promises.writeFile(
    './data/' + symbol,
    headers.join(',') + '\n' + data
  );
  console.log('Written in ./data/' + symbol);
};

export const clearPerformances = async () => {
  await pg.query('DELETE FROM performance');
  console.debug('All performances were removed.');
};
export const savePerformance = async (
  info: BinanceInfo,
  strategy: string,
  symbol: string,
  extractor: string,
  performance: number | null
) => {
  await pg.query<BinanceInfo>(
    `INSERT INTO performance (url, strategy, symbol, performance, extractor)
    VALUES ($1, $2, $3, $4, $5)`,
    [info.url, strategy, symbol, performance, extractor]
  );
  console.debug('exported: ', strategy, symbol, performance, extractor);
};
