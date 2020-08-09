import { getAssetFromInfo, getWords } from './formating';
import { Extractor } from '../types';
import { getAllAssets, getCombinedSymbols } from './helpers';

// ALL IF THESE EXTRACTORS ARE NOT USED ANYMORE
// Refer to `simplifiedEtractors`

export const allCurrency: Extractor = async info => {
  const allAssets = await getAllAssets();
  const assets = await getAssetFromInfo(info, allAssets);
  const symbols = await getCombinedSymbols(assets, assets);
  return symbols;
};

export const relatedAgainstUsdt: Extractor = async info => {
  const allAssets = await getAllAssets();
  const assets = await getAssetFromInfo(info, allAssets);
  const symbols = await getCombinedSymbols(assets, ['USDT']);
  return symbols;
};

export const relatedAgainstBnb: Extractor = async info => {
  const allAssets = await getAllAssets();
  const assets = await getAssetFromInfo(info, allAssets);
  const symbols = await getCombinedSymbols(assets, ['BNB']);
  return symbols;
};

export const relatedAgainstUsdtAndBnb: Extractor = async info => {
  const symbolsUsdt = await relatedAgainstUsdt(info);
  const symbolsBnb = await relatedAgainstBnb(info);
  return symbolsUsdt.concat(symbolsBnb);
};

export const onlyBnb: Extractor = async news => {
  if (news.title == null) return [];
  return ['BNBUSDT'];
};

const COLD_WORDS = ['removal', 'delist', 'distributed'];
export const filterByColdWord: Extractor = async news => {
  if (news.title == null) return [];
  const words = getWords(news.title);
  if (COLD_WORDS.some(word => words.includes(word))) return [];
  return relatedAgainstUsdt(news);
};

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
];

export const filterCharly: Extractor = async news => {
  if (news.title == null) return [];
  if (hotComparators.some(comparator => comparator(news.title)))
    return relatedAgainstUsdt(news);
  return [];
};
