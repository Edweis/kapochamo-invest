import { sendEmail } from '../../services/aws/sns';
import { BinanceInfo } from '../../types';
import { getSymbols } from '../../services/aws/dynamoDb';

const TRADE_BASE_URL = 'https://www.binance.com/en/trade/';
export const getChartFromSymbol = async (symbol: string) => {
  const assets = await getSymbols();
  const asset = assets.find(asset => asset.symbol === symbol);
  if (asset == null)
    throw Error(`Asset ${symbol} is not referenced in database.`);
  return `${TRADE_BASE_URL + asset.baseAsset}_${asset.quoteAsset}`;
};

export const watcherReportTemplate = async (
  info: BinanceInfo,
  symbols: string[]
) => {
  const chartUrls = symbols.map(getChartFromSymbol);
  let message = 'A news was published : \n\n';
  message += `${info.title}\n`;
  message += `${info.url}\n\n`;
  message += `Published at :\t${info.time.toISOString()}\n`;
  message += `Action at : \t${new Date().toISOString()}\n`;
  message += `Traded on ${symbols.join(', ')}\n`;
  message += `\t${chartUrls.join('\n')}`;
  await sendEmail(message);
};
