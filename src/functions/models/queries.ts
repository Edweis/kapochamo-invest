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

export const getSymbols = async (
  baseAssets: Asset[],
  quoteAssets: Asset[]
): Promise<AssetSymbol[]> => {
  const response = await pg.query(
    `SELECT symbol FROM symbol
    WHERE base_asset = ANY ($1) AND
    quote_asset = ANY ($2)
    ORDER BY 1`,
    [baseAssets, quoteAssets]
  );
  return response.rows.map(row => row.symbol) as string[];
};

export const getNews = async () => {
  const reponse = await pg.query<BinanceInfo>(
    `SELECT * FROM news ORDER BY time DESC`
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
