import pg from '../services/postgres';
import { BinanceInfo } from '../types';
import _ from 'lodash';
import moment from 'moment';
import { binancePublic } from '../api';
import fs from 'fs';
type Asset = string;
type AssetSymbol = string;

const MATCH_SPEC_CHAR = /[^\w\s]/gi;
const MATCH_NON_UPPER = /[^A-Z]/g;
const MATCH_DUPLICATED_SPACE = / +(?= )/g;
export const getAllAssets = async () => {
  const response = await pg.query(
    `SELECT distinct asset FROM (
      SELECT DISTINCT base_asset as asset FROM symbol
      UNION
      SELECT DISTINCT quote_asset as asset FROM symbol
    ) as sub ORDER BY 1`
  );
  return response.rows.map(row => row.asset) as string[];
};

export const getAllSymbolFromAsset = async (
  assets: Asset[]
): Promise<AssetSymbol[]> => {
  const response = await pg.query(
    `SELECT symbol FROM symbol
    WHERE base_asset = ANY ($1) or
    quote_asset = ANY ($1) ORDER BY 1`,
    [assets]
  );
  console.debug('done 1');
  return response.rows.map(row => row.symbol) as string[];
};

export const getNews = async () => {
  const reponse = await pg.query<BinanceInfo>(
    `SELECT title, time, content FROM news`
  );
  return reponse.rows;
};

export const getOneNews = async (title: string) => {
  const reponse = await pg.query<BinanceInfo>(
    `SELECT title, time, content FROM news WHERE title=$1`,
    [title]
  );
  if (reponse.rows.length === 0) throw Error('Title "' + title + '" not found');
  return reponse.rows[0];
};

export const getAssetsFromText = (text: string, assets: string[]) => {
  const assetMaxLength = assets
    .map(asset => asset.length)
    .reduce((acc, value) => (acc > value ? acc : value), 0);
  const assetMinLength = assets
    .map(asset => asset.length)
    .reduce((acc, value) => (acc < value ? acc : value), Infinity);

  const tokens = text
    .replace(MATCH_SPEC_CHAR, ' ')
    .replace(MATCH_NON_UPPER, ' ')
    .replace(MATCH_DUPLICATED_SPACE, '')
    .trim()
    .split(' ')
    .filter(
      word => word.length <= assetMaxLength && word.length >= assetMinLength
    );
  return assets.filter(asset => tokens.includes(asset));
};

export const getAssetFromInfo = (
  info: BinanceInfo,
  assets: string[]
): Asset[] => {
  const tokenText = getAssetsFromText(info.content || '', assets);
  const tokenTitle = getAssetsFromText(info.title || '', assets);
  return _.uniq([...tokenText, ...tokenTitle]);
};

export const getTickAround = async (time: Date, symbol: AssetSymbol) => {
  const INTERVAL = '1m';
  const NUMBER_TICKS = 100;
  const now = moment(time).unix() * 1000;
  const params = { symbol, limit: NUMBER_TICKS, interval: INTERVAL };
  const paramBefore = { ...params, endTime: now };
  const paramAfter = { ...params, startTime: now };
  const ticksBefore = await binancePublic.get('/klines', {
    params: paramBefore,
  });
  const ticksAfter = await binancePublic.get('/klines', { params: paramAfter });
  const allTicks = ticksBefore.data.concat(ticksAfter.data);

  // Sometime the API goes beyonf the required date, we filter out theses
  const later = now + NUMBER_TICKS * 60 * 1000;
  const earlier = now - NUMBER_TICKS * 60 * 1000;

  return allTicks.filter((tick: any) => earlier <= tick[0] && tick[0] <= later);
};

export const getTicksAroundNews = async (info: BinanceInfo) => {
  if (info.time == null) throw Error("Can't evaluate a null date");
  const time = info.time;
  const allAssets = await getAllAssets();
  const assets = getAssetFromInfo(info, allAssets);
  const symbols = await getAllSymbolFromAsset(assets);
  await Promise.all(
    symbols
      .filter(symbol => symbol.endsWith('USDT'))
      .map(async symbol => {
        const ticks = await getTickAround(new Date(time), symbol);
        const headers = [
          'open time',
          'open',
          'high',
          'low',
          'close',
          'volume',
          'close time',
          'quote asset volume',
          'number of trades',
          'taker buy base asset volume',
          'taker buy quote asset volume',
          'ignore',
        ].join(',');
        const data = ticks.join('\n');
        await fs.promises.writeFile('./data/' + symbol, headers + '\n' + data);
        console.log('Written in ./data/' + symbol);
      })
  );
};
