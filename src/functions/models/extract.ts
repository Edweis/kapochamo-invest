import { BinanceInfo } from '../../types';
import { Asset } from './types';
import _ from 'lodash';
const MATCH_SPEC_CHAR = /[^\w\s]/gi;
const MATCH_NON_UPPER = /[^A-Z]/g;
const MATCH_DUPLICATED_SPACE = / +(?= )/g;

export const getAssetsFromText = (text: string, assets: string[]) => {
  const assetMaxLength = assets
    .map(asset => asset.length)
    .reduce((acc, value) => (acc > value ? acc : value), 0);
  const assetMinLength = assets
    .map(asset => asset.length)
    .reduce((acc, value) => (acc < value ? acc : value), Infinity);

  const tokens = text
    .replace(MATCH_SPEC_CHAR, ' ')
    .replace(MATCH_NON_UPPER, ' ')
    .replace(MATCH_DUPLICATED_SPACE, '')
    .trim()
    .split(' ')
    .filter(
      word => word.length <= assetMaxLength && word.length >= assetMinLength
    );
  return assets.filter(asset => tokens.includes(asset));
};

export const getAssetFromInfo = (
  info: BinanceInfo,
  assets: string[]
): Asset[] => {
  const tokenText = getAssetsFromText(info.content || '', assets);
  const tokenTitle = getAssetsFromText(info.title || '', assets);
  return _.uniq([...tokenText, ...tokenTitle]);
};
