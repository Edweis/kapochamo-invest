import { getSymbols } from '../../services/aws/dynamoDb';
import Profiling from './profiling';

const TRADE_BASE_URL = 'https://www.binance.com/en/trade/';
export const getChartFromSymbol = async (symbol: string) => {
  const assets = await getSymbols();
  const asset = assets.find(asset => asset.symbol === symbol);
  if (asset == null)
    throw Error(`Asset ${symbol} is not referenced in database.`);
  return `${TRADE_BASE_URL + asset.baseAsset}_${asset.quoteAsset}`;
};

const KAPO_API_BASE_URL = 'https://api.kapochamo.com/view?limit=90'; // &symbol=KAVAUSDT&time=1591600700509'
export const getChartApiFromSymbol = (symbol: string, time: number) =>
  `${KAPO_API_BASE_URL}&symbol=${symbol}&time=${time}`;

export const watcherReportTemplate = async (
  url: string,
  title: string,
  symbols: string[],
  profiling: Profiling
) => {
  const timestamp = Date.now();
  const chartUrls = await Promise.all(symbols.map(getChartFromSymbol));
  const chartsApiUrl = symbols.map(symbol =>
    getChartApiFromSymbol(symbol, timestamp)
  );
  let message = 'A news was published : \n\n';
  message += `${title}\n`;
  message += `${url}\n\n`;
  message += `Action at : ${new Date().toISOString()}\n`;
  message += `Traded on ${symbols.join(', ')}\n`;
  message += `\n--- Profiling ---\n`;
  message += `${profiling.toString()}\n\n`;
  message += `${profiling.getTotal()}\n`;
  message += `\n--- Charts ---\n`;
  message += `Chart Binance : \n${chartUrls.join('\n')}\n\n`;
  message += `Chart Kapochamo : \n${chartsApiUrl.join('\n')}\n`;
  return message;
};
