import _ from 'lodash';
import { BinanceInfo } from '../../types';
import { Asset } from '../types';

const MATCH_SPEC_CHAR = /[^\w\s]/gi;
const MATCH_NON_UPPER = /[^A-Z]/g;
const MATCH_DUPLICATED_SPACE = / +(?= )/g;

export const getWords = (text: string, matchUpper = false): string[] => {
  if (text === '') return [];
  const formatedText = matchUpper
    ? text.replace(MATCH_NON_UPPER, ' ')
    : text.toLowerCase();
  return formatedText
    .replace(MATCH_SPEC_CHAR, ' ')
    .replace(MATCH_DUPLICATED_SPACE, '')
    .trim()
    .split(' ')
    .filter(token => token !== '');
};

export const getAssetsFromText = (text: string, assets: string[]) => {
  const assetMaxLength = assets
    .map(asset => asset.length)
    .reduce((acc, value) => (acc > value ? acc : value), 0);
  const assetMinLength = assets
    .map(asset => asset.length)
    .reduce((acc, value) => (acc < value ? acc : value), Infinity);

  const tokens = getWords(text, true).filter(
    word => word.length <= assetMaxLength && word.length >= assetMinLength
  );
  return assets.filter(asset => tokens.includes(asset));
};

export const getAssetFromInfo = async (
  info: BinanceInfo,
  assets: string[]
): Promise<Asset[]> => {
  const tokenText = getAssetsFromText((await info.getContent()) || '', assets);
  const tokenTitle = getAssetsFromText(info.title || '', assets);
  const uniqAssets = _.uniq([...tokenText, ...tokenTitle]);
  return uniqAssets.sort();
};
