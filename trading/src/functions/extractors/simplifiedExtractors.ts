import { getSymbols, TradeSymbol } from '../../services/aws/dynamoDb';

const hotComparators: Array<(text: string) => boolean> = [
  text =>
    (/\Wlists/i.test(text) || /\Wwill list/i.test(text)) &&
    !/community/i.test(text) &&
    !/pair/i.test(text),
  text =>
    /Community Coin Vote/i.test(text) &&
    /vs/i.test(text) &&
    !/list/i.test(text) &&
    !/started/i.test(text),
  text => /adds margin trading/i.test(text),
  text => /adds/i.test(text) && /trading pair/i.test(text),
  text => /futures will launch/i.test(text),
  text => /competition/i.test(text) && /[0-9,]{2,}/i.test(text),
  text => /!/i.test(text),
  text =>
    /trading/i.test(text) && /airdrop/i.test(text) && !/concluded/i.test(text),
  text => /support/i.test(text) && !/discontinue/i.test(text),
  text => /introducing/i.test(text),
];

type TradeableSymbols = { [asset: string]: string };
export const getTradeableSymbols = (symbols: TradeSymbol[]) =>
  symbols
    .filter(symbol => symbol.quoteAsset === 'USDT')
    .reduce(
      (a, v) => ({ ...a, [v.baseAsset]: v.symbol }),
      {}
    ) as TradeableSymbols;

let tradeableSymbols: TradeableSymbols = {};
export const isReady = getSymbols().then(symbols => {
  tradeableSymbols = getTradeableSymbols(symbols);
});
const GET_ASSETS = /[A-Z]{3,6}/g;

export const extractCharly = (title: string) => {
  if (hotComparators.some(comparator => comparator(title))) {
    // eslint-disable-next-line
    // @ts-ignore
    const potentialAssets = [...title.matchAll(GET_ASSETS)].map(
      match => match[0]
    );
    return potentialAssets
      .map(asset => tradeableSymbols[asset])
      .filter(asset => asset != null)
      .concat('BNBUSDT');
  }
  return [];
};
