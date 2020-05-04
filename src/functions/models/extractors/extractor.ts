import { getAssetFromInfo } from './extract';
import { Extractor } from '../types';
import { getAllAssets, getRelevantSymbolFromAsset } from '../queries';

export const allCurrency: Extractor = async info => {
  const allAssets = await getAllAssets();
  const assets = getAssetFromInfo(info, allAssets);
  const symbols = await getRelevantSymbolFromAsset(assets);
  return symbols;
};

export const onlyBnb: Extractor = async news => {
  if (news.title == null) return [];
  return ['BNBUSDT'];
};
