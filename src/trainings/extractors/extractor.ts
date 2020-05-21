import { getAssetFromInfo } from './extract';
import { Extractor } from '../types';
import { getAllAssets, getSymbols } from '../queries';

const assetPromise = getAllAssets();

export const allCurrency: Extractor = async info => {
  const allAssets = await assetPromise;
  const assets = getAssetFromInfo(info, allAssets);
  const symbols = await getSymbols(assets, assets);
  return symbols;
};

export const relatedAgainstUsdt: Extractor = async info => {
  const allAssets = await assetPromise;
  const assets = getAssetFromInfo(info, allAssets);
  const symbols = await getSymbols(assets, ['USDT']);
  return symbols;
};

export const relatedAgainstBnb: Extractor = async info => {
  const allAssets = await assetPromise;
  const assets = getAssetFromInfo(info, allAssets);
  const symbols = await getSymbols(assets, ['BNB']);
  return symbols;
};

export const onlyBnb: Extractor = async news => {
  if (news.title == null) return [];
  return ['BNBUSDT'];
};
