import pg from '../../services/postgres';
import { Asset, AssetSymbol } from './types';
import { BinanceInfo } from '../../types';

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
