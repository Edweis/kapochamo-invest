export type Exchange = {
  unix: number;
  date: Date;
  symbol: string;
  price: number;
  amount: number;
  dollarAmount: number;
  type: 'buy' | 'sell';
  transId: number;
  nextUnix: number | null;
  prevUnix: number | null;
};
export type StockPrice = Exchange[];
export type BuyWhen = (pastStock: StockPrice) => boolean;
export type SellWhen = (pastStock: StockPrice) => boolean;
export type TickGenerator = Generator<Exchange[], null, void>;
