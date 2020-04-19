import pg from '../services/postgres';
import { binancePublic } from '../api';

export const populateSymbols = async () => {
  const result = await binancePublic.get('/exchangeInfo');
  const { data } = result;
  await Promise.all(
    data.symbols.map(async (datum: any) => {
      console.log('inserting ', datum.symbol);
      await pg.query(
        `INSERT INTO symbol(symbol, status, base_asset, quote_asset)
      VALUES($1, $2, $3, $4) RETURNING *`,
        [datum.symbol, datum.status, datum.baseAsset, datum.quoteAsset]
      );
    })
  );
};
