import { SellerMessage } from '../../types';
import { getSymbols } from '../../services/aws/dynamoDb';

const computePrice = (response: SellerMessage) =>
  response.fills
    .map(fill => Number(fill.price) * Number(fill.qty))
    .reduce((acc, value) => acc + value, 0) / response.origQty;

const getTime = (date: Date) =>
  date
    .toISOString()
    .split('T')[1]
    .replace('Z', '');
const getDate = (date: Date) => date.toISOString().split('T')[0];
const getVariation = (start: number, end: number) => {
  const variation = ((100 * (start - end)) / start).toFixed(4);
  return `${variation}%`;
};

const getTimeDiff = (start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime();
  const ms = diff % 1000;
  const sec = ((diff - ms) / 1000) % 60;
  const min = (diff - ms - sec * 1000) / 60000;
  return `    ${min}:${sec}:${ms}`;
};
export const buildReport = async (
  buyResponse: SellerMessage,
  sellReponse: SellerMessage
) => {
  const assets = await getSymbols();
  const asset = assets.find(asset => asset.symbol === buyResponse.symbol);
  if (asset == null) throw Error(`unknown symbol ${buyResponse.symbol}`);

  const buyQuoteQty = buyResponse.cummulativeQuoteQty;
  const buyBaseQty = buyResponse.executedQty;
  const sellQuoteQty = sellReponse.cummulativeQuoteQty;
  const sellBaseQty = sellReponse.executedQty;

  const buyTime = new Date(buyResponse.transactTime);
  const sellTime = new Date(sellReponse.transactTime);

  const buyPrice = computePrice(buyResponse);
  const sellPrice = computePrice(sellReponse);

  let message = `Trading report for ${asset.symbol} on ${getDate(buyTime)}\n`;
  message += `\n`;
  message += `Buy \t ${getTime(buyTime)}\t `;
  message += `${buyQuoteQty} ${asset.quoteAsset}\t -> \t${buyBaseQty} ${asset.baseAsset}\n`;
  message += `Waited for \t ${getTimeDiff(buyTime, sellTime)}`;
  message += `\t variation ${getVariation(buyQuoteQty, sellQuoteQty)}\n`;
  message += `Sell\t ${getTime(sellTime)}\t `;
  message += `${sellQuoteQty} ${asset.quoteAsset}\t <- \t${sellBaseQty} ${asset.baseAsset}\n`;
  message += `\n`;
  message += `Buy price : ${buyPrice} ${asset.quoteAsset}/${asset.baseAsset}\n`;
  message += `Sell price : ${sellPrice} ${asset.quoteAsset}/${asset.baseAsset}\n`;
  message += `\n`;
  message += `Have a good day 💃 !`;
  return message;
};
