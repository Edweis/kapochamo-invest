import HttpStatus from 'http-status-codes';
import nunjucks from 'nunjucks';
import _sortBy from 'lodash/sortBy';
import template from './template.html';
import {
  getTransactions,
  getSymbols,
  getPublications,
  Publication,
} from '../../services/aws/dynamoDb';
import { getLinkFromSymbol, linkify } from './links';
import { computePrice } from '../../helpers';

const MAX_ITEM_DISPLAY = 100;
type EventCommon = {
  type: 'BUY' | 'SELL' | 'NEWS';
  timestamp: number;
  content: string;
};
type TransactionEvent = {
  quoteAsset?: string;
  baseAsset?: string;
  variation: number | null;
  price: number;
} & EventCommon;
type PublicationEvent = Publication & EventCommon;
type EventTemplate = Array<PublicationEvent | TransactionEvent>;
nunjucks.configure({ autoescape: false });
const leftArrow = '<i class="fas fa-arrow-left"></i>';
const rightArrow = '<i class="fas fa-arrow-right"></i>';

const handler = async () => {
  const symbols = await getSymbols();
  const transactions = await getTransactions();
  const publications = await getPublications();
  const transactionEvents: TransactionEvent[] = transactions.map(
    transaction => {
      const { response } = transaction;
      const symbol = symbols.find(({ symbol }) => symbol === response.symbol);
      const buyQuoteQty = response.cummulativeQuoteQty;
      const buyBaseQty = response.executedQty;
      const timestamp = transaction.transactTime;
      const quoteAsset = symbol?.quoteAsset;
      const baseAsset = symbol?.baseAsset;
      let content =
        response.side === 'BUY'
          ? `Bought ${buyQuoteQty} ${quoteAsset} ${rightArrow} ${buyBaseQty} ${baseAsset}`
          : `Sold ${buyQuoteQty} ${quoteAsset} ${leftArrow} ${buyBaseQty} ${baseAsset}`;
      content += getLinkFromSymbol(symbols, timestamp, response.symbol);

      return {
        type: response.side,
        price: computePrice(response),
        quoteAsset: symbol?.quoteAsset,
        baseAsset: symbol?.baseAsset,
        variation: transaction.variation,
        timestamp,
        content,
      };
    }
  );
  const publicationEvents: PublicationEvent[] = publications
    .splice(0, MAX_ITEM_DISPLAY)
    .map(publication => {
      const links = publication.symbolsTraded
        .map(symbol => {
          const link = getLinkFromSymbol(
            symbols,
            publication.timestamp,
            symbol
          );
          return `\t ${symbol}${link}`;
        })
        .map(line => `<li class="email-desc">${line}</li>`)
        .join('');

      const linksTag =
        links.length > 0 ? `<ul>${links}</ul>` : ' <br/><b>Not traded</b>';
      const newsLink = linkify(publication.url, 'Link');
      return {
        ...publication,
        type: 'NEWS',
        content: `${publication.title} - ${newsLink}${linksTag}`,
      };
    });
  const events = (transactionEvents as EventTemplate).concat(publicationEvents);
  const sortedEvents = _sortBy(events, 'timestamp').reverse();
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
