import pg from '../services/postgres';
import { BinanceInfo } from '../types';
import _ from 'lodash';
import moment from 'moment';
import { binancePublic } from '../api';

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

export const getNews = async (): Promise<BinanceInfo[]> => {
  const reponse = await pg.query(`SELECT title, time, content FROM news`);
  return reponse.rows;
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

export const getAssetFromInfo = (info: BinanceInfo, assets: string[]) => {
  const tokenText = getAssetsFromText(info.text || '', assets);
  const tokenTitle = getAssetsFromText(info.title || '', assets);
  return _.uniq([...tokenText, ...tokenTitle]);
};

export const populateTickFromAsset = async (time: Date, asset: string) => {
  const INTERVAL = '1m';
  const NUMBER_TICKS = 1000;
  const NUMBER_PAST_TICKS = 250;
  const BASE_SYMBOL = 'USDT';
  const startTime =
    moment(time)
      .subtract(NUMBER_PAST_TICKS, 'minutes')
      .unix() * 1000;
  const params = {
    symbol: asset + BASE_SYMBOL,
    limit: NUMBER_TICKS,
    interval: INTERVAL,
    startTime,
  };
  const result = await binancePublic.get('/klines', { params });
  return result.data;
};
