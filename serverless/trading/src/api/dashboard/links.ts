import { TradeSymbol } from '../../services/aws/dynamoDb';

const getKapoLink = (
  timestamp: number,
  baseAsset: string,
  quoteAsset: string
) => {
  const symbol = `${baseAsset}${quoteAsset}`;
  return `https://api.kapochamo.com/view?time=${timestamp}&symbol=${symbol}`;
};

const getBinanceLink = (baseAsset: string, quoteAsset: string) => {
  return `https://www.binance.com/en/trade/${baseAsset}_${quoteAsset}`;
};

export const linkify = (url: string, text: string) =>
  `<a href="${url}" target="_blank">${text}</a>`;

export const getLinkFromSymbol = (
  symbols: TradeSymbol[],
  timestamp: number,
  symbolToParse: string
) => {
  const symbol = symbols.find(({ symbol }) => symbol === symbolToParse);
  const quoteAsset = symbol?.quoteAsset;
  const baseAsset = symbol?.baseAsset;
  if (baseAsset && quoteAsset) {
    const kapoLink = getKapoLink(timestamp, baseAsset, quoteAsset);
    const binanceLink = getBinanceLink(baseAsset, quoteAsset);
    return ` - ${linkify(kapoLink, 'Chart')} - ${linkify(binanceLink, 'Live')}`;
  }
  return '';
};
