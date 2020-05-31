import { getAssetFromInfo, getWords } from './formating';
import { Extractor } from '../types';
import { getAllAssets, getCombinedSymbols } from './helpers';

export const allCurrency: Extractor = async info => {
  const allAssets = await getAllAssets();
  const assets = getAssetFromInfo(info, allAssets);
  const symbols = await getCombinedSymbols(assets, assets);
  return symbols;
};

export const relatedAgainstUsdt: Extractor = async info => {
  const allAssets = await getAllAssets();
  const assets = getAssetFromInfo(info, allAssets);
  const symbols = await getCombinedSymbols(assets, ['USDT']);
  return symbols;
};

export const relatedAgainstBnb: Extractor = async info => {
  const allAssets = await getAllAssets();
  const assets = getAssetFromInfo(info, allAssets);
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
  text => /futures will launch/i.test(text),
  text => /competition/i.test(text) && /[0-9,]{2,}/i.test(text),
  text => /!/i.test(text),
  text =>
    /trading/i.test(text) && /airdrop/i.test(text) && !/concluded/i.test(text),
  text => /support/i.test(text) && !/discontinue/i.test(text),
];

export const filterCharly: Extractor = async news => {
  if (news.title == null) return [];
  if (hotComparators.some(comparator => comparator(news.title)))
    return relatedAgainstUsdt(news);
  return [];
};
