console.debug('Starts');
const EVENT_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL',
  NEWS: 'NEWS',
};

const getLink = event => {
  if (event.link != null) return event.link;
  const { timestamp } = event;
  const symbol = event.baseAsset + event.quoteAsset;
  return `https://api.kapochamo.com/view?time=${timestamp}&symbol=${symbol}`;
};

const getEventName = event => {
  switch (event.type) {
    case EVENT_TYPES.BUY:
      return `Bought ${event.baseAsset}/${event.quoteAsset}`;
    case EVENT_TYPES.SELL:
      // const symbol = event.variation > 0 ? '+' : '';
      return `Sold ${event.baseAsset}/${event.quoteAsset}`;
    case EVENT_TYPES.NEWS:
      return 'News Caught';
    default:
      console.error(event);
      throw Error(`Type ${event.type} not found.`);
  }
};
const eventIconMap = {
  BUY: `
  <span style="font-size: 32px; color: darkgreen; margin:auto;">
    <i class="fas fa-arrow-alt-circle-left"></i>
  </span>
`,
  SELL: `
  <span style="font-size: 32px; color: darkred; margin:auto;">
    <i class="fas fa-arrow-alt-circle-right"></i>
  </span>
`,
  NEWS: `
  <span style="font-size: 32px; color: darkblue; margin:auto;">
    <i class="fas fa-info"></i>
  </span>
`,
};
// eslint-disable-next-line
const renderEvents = events =>
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
   - <a href="${getLink(event)}" target="_blank">link</a>
  </p>
  </div>`;
    document.querySelector('#list').appendChild(node);
  });
