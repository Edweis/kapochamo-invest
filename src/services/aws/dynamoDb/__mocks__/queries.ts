import pg from '../../../postgres';
import { TradeSymbol } from '../helpers';

export const getSymbols = async (): Promise<TradeSymbol[]> => {
  const results = await pg.query<TradeSymbol>(
    `SELECT * FROM symbol ORDER BY symbol`
  );
  return results.rows;
};
export const resetSymbols = async (symbols: TradeSymbol[]) => {
  await Promise.all(
    symbols.map(async symbol =>
      pg.query(
        `INSERT INTO symbol(symbol, status, "baseAsset", "quoteAsset")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (symbol) DO NOTHING`,
        [symbol.symbol, symbol.status, symbol.baseAsset, symbol.quoteAsset]
      )
    )
  );
};

const LATEST_NEWS =
  'https://binance.zendesk.com/hc/en-us/articles/360042918512';
export const getExistingUrl = async (url: string) =>
  url === LATEST_NEWS ? { url } : null;
export const updateNews = async () => {};
