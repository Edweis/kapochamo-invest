import HttpStatus from 'http-status-codes';
import nunjucks from 'nunjucks';
// import { binancePublic } from '../../services/binance';
import _sortBy from 'lodash/sortBy';
import template from './template.html';
import { getTransactions, getSymbols } from '../../services/aws/dynamoDb';

type TransactionEvent = {
  type: 'BUY' | 'SELL' | 'NEWS';
  timestamp: number;
  quoteAsset?: string;
  baseAsset?: string;
  variation: number | null;
  content: string;
};

nunjucks.configure({ autoescape: false });
console.debug(template.length);
const leftArrow = '<i class="fas fa-arrow-left"></i>';
const rightArrow = '<i class="fas fa-arrow-right"></i>';

const handler = async () => {
  const symbols = await getSymbols();

  const transactions = await getTransactions();
  const events: TransactionEvent[] = transactions.map(transaction => {
    const { response } = transaction;
    const symbol = symbols.find(({ symbol }) => symbol === response.symbol);
    const buyQuoteQty = response.cummulativeQuoteQty;
    const buyBaseQty = response.executedQty;

    const content =
      response.side === 'BUY'
        ? `Bought ${buyQuoteQty} ${symbol?.quoteAsset} ${rightArrow} ${buyBaseQty} ${symbol?.baseAsset}`
        : `Sold ${buyQuoteQty} ${symbol?.quoteAsset} ${leftArrow} ${buyBaseQty} ${symbol?.baseAsset}`;
    return {
      type: response.side,
      timestamp: transaction.transactTime,
      quoteAsset: symbol?.quoteAsset,
      baseAsset: symbol?.baseAsset,
      variation: transaction.variation,
      content,
    };
  });
  const sortedEvents = _sortBy(events, 'transactTime');
  const page = nunjucks.renderString(template, {
    events: JSON.stringify(sortedEvents),
  });
  return {
    statusCode: HttpStatus.OK,
    headers: { 'Content-Type': 'text/html' },
    body: page,
  };
};

export default handler;
