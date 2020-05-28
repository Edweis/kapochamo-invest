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
