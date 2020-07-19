import { getSymbols } from '../../services/aws/dynamoDb';

export const getAllAssets = async () => {
  const tradeSymbols = await getSymbols();
  const assets: string[] = [];
  tradeSymbols.forEach(tradeSymbol => {
    if (!assets.includes(tradeSymbol.baseAsset))
      assets.push(tradeSymbol.baseAsset);
    if (!assets.includes(tradeSymbol.quoteAsset))
      assets.push(tradeSymbol.quoteAsset);
  });
  return assets;
};

export const getCombinedSymbols = async (
  baseAssets: string[],
  quoteAssets: string[]
) => {
  const tradeSymbols = await getSymbols();
  return tradeSymbols
    .filter(
      tradeSymbol =>
        baseAssets.includes(tradeSymbol.baseAsset) &&
        quoteAssets.includes(tradeSymbol.quoteAsset)
    )
    .map(tradeSymbol => tradeSymbol.symbol);
};
