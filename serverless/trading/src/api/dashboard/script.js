console.debug('Starts');
const EVENT_TYPES = {
  buy: 'buy',
  sell: 'sell',
  news: 'news',
};
const getLink = event => {
  if (event.link != null) return event.link;
  const { time } = event;
  const { symbol } = event;
  return `https://api.kapochamo.com/view?time=${time}&symbol=${symbol}`;
};
const events = [
  {
    type: 'sell',
    timestamp: 1591961531658 - 30000,
    symbol: 'BNB_USDT',
    variation: 4.6543,
    content: 'XXX',
  },
  { type: 'buy', timestamp: 1591961531658, symbol: 'BNB_USDT', content: 'XXX' },
  {
    type: 'news',
    timestamp: 1591961531658 - 50000,
    content: 'Introducing the Cartesi (CTSI) Token Sale on Binance Launchpad',
    link:
      'https://binance.zendesk.com/hc/en-us/articles/360041795572-Introducing-the-Cartesi-CTSI-Token-Sale-on-Binance-Launchpad',
  },
  {
    type: 'sell',
    timestamp: 1591961531658 - 30000,
    symbol: 'BNB_USDT',
    variation: 4.6543,
    content: 'XXX',
  },
  { type: 'buy', timestamp: 1591961531658, symbol: 'BNB_USDT', content: 'XXX' },
  {
    type: 'news',
    timestamp: 1591961531658 - 50000,
    content: 'Introducing the Cartesi (CTSI) Token Sale on Binance Launchpad',
    link:
      'https://binance.zendesk.com/hc/en-us/articles/360041795572-Introducing-the-Cartesi-CTSI-Token-Sale-on-Binance-Launchpad',
  },
  {
    type: 'sell',
    timestamp: 1591961531658 - 30000,
    symbol: 'BNB_USDT',
    variation: 4.6543,
    content: 'XXX',
  },
  { type: 'buy', timestamp: 1591961531658, symbol: 'BNB_USDT', content: 'XXX' },
  {
    type: 'news',
    timestamp: 1591961531658 - 50000,
    content: 'Introducing the Cartesi (CTSI) Token Sale on Binance Launchpad',
    link:
      'https://binance.zendesk.com/hc/en-us/articles/360041795572-Introducing-the-Cartesi-CTSI-Token-Sale-on-Binance-Launchpad',
  },
  {
    type: 'sell',
    timestamp: 1591961531658 - 30000,
    symbol: 'BNB_USDT',
    variation: 4.6543,
    content: 'XXX',
  },
  { type: 'buy', timestamp: 1591961531658, symbol: 'BNB_USDT', content: 'XXX' },
  {
    type: 'news',
    timestamp: 1591961531658 - 50000,
    content: 'Introducing the Cartesi (CTSI) Token Sale on Binance Launchpad',
    link:
      'https://binance.zendesk.com/hc/en-us/articles/360041795572-Introducing-the-Cartesi-CTSI-Token-Sale-on-Binance-Launchpad',
  },
  {
    type: 'sell',
    timestamp: 1591961531658 - 30000,
    symbol: 'BNB_USDT',
    variation: 4.6543,
    content: 'XXX',
  },
  { type: 'buy', timestamp: 1591961531658, symbol: 'BNB_USDT', content: 'XXX' },
  {
    type: 'news',
    timestamp: 1591961531658 - 50000,
    content: 'Introducing the Cartesi (CTSI) Token Sale on Binance Launchpad',
    link:
      'https://binance.zendesk.com/hc/en-us/articles/360041795572-Introducing-the-Cartesi-CTSI-Token-Sale-on-Binance-Launchpad',
  },
];
const getEventName = event => {
  switch (event.type) {
    case EVENT_TYPES.buy:
      return `Bought ${event.symbol}`;
    case EVENT_TYPES.sell:
      // const symbol = event.variation > 0 ? '+' : '';
      return `Sold ${event.symbol}`;
    case EVENT_TYPES.news:
      return 'News Caught';
    default:
      console.error(event);
      throw Error(`Type ${event.type} not found.`);
  }
};
const eventIconMap = {
  buy: `
  <span style="font-size: 32px; color: darkgreen; margin:auto;">
    <i class="fas fa-arrow-alt-circle-left"></i>
  </span>
`,
  sell: `
  <span style="font-size: 32px; color: darkred; margin:auto;">
    <i class="fas fa-arrow-alt-circle-right"></i>
  </span>
`,
  news: `
  <span style="font-size: 32px; color: darkblue; margin:auto;">
    <i class="fas fa-info"></i>
  </span>
`,
};
events.forEach(event => {
  const node = document.createElement('div');
  node.classList.add('email-item');
  node.classList.add('pure-g');
  const date = new Date(event.timestamp).toISOString();
  node.innerHTML = `
  <div class="pure-u-1-12" style="display:flex;">
  ${eventIconMap[event.type]}
  </div>
  <div class="pure-u">
  <h5 class="email-name">${date}</h5>
  <h4 class="email-subject">${getEventName(event)}</h4>
  <p class="email-desc">
  ${event.content}
   - <a href="${getLink(event)}">link</a>
  </p>
  </div>`;
  document.querySelector('#list').appendChild(node);
});
