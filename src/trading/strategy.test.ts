import { NumberGenerator } from './numberGenerator';

describe('Currency', () => {
  const SYMBOL = 'BTC/USDT';
  const currency = new NumberGenerator(SYMBOL);
  it('should instanciate', () => {
    expect(currency.symbol).toEqual(SYMBOL);
  });
  it('should get the earliest tick', () => {
    const startId = currency.startId;
    const firstTick = currency.getValueAt(startId);
    expect(firstTick.value).toEqual(0);
    expect(firstTick.id).toEqual(startId);
    expect(firstTick.nextId).not.toEqual(null);
    expect(firstTick.prevId).toEqual(null);
  });
  it('should get the latest tick', () => {
    const endId = currency.endId;
    const firstTick = currency.getValueAt(endId);
    expect(firstTick.value).toEqual(31622400);
    expect(firstTick.id).toEqual(endId);
    expect(firstTick.nextId).toEqual(null);
    expect(firstTick.prevId).not.toEqual(null);
  });
  it('should get the list of ticks', () => {
    const endId = currency.endId;
    const firstTick = currency.getValueAt(endId);
    expect(firstTick.value).toEqual(31622400);
    expect(firstTick.id).toEqual(endId);
    expect(firstTick.nextId).toEqual(null);
    expect(firstTick.prevId).not.toEqual(null);
  });
  it('getFirstValues', () => {
    expect(currency.getFirstValues(3).map(({ value }) => value)).toEqual([
      0,
      400,
      800,
    ]);
    expect(currency.getFirstValues(1).map(({ value }) => value)).toEqual([0]);
  });
  it('getListUntil on tick', () => {
    const unix = currency.startId + 400 * 1000;
    const generator = currency.getListUntil(unix, 5);

    const firstIter = generator.next().value;

    expect(firstIter).not.toEqual(null);
    if (firstIter == null) throw Error();
    expect(firstIter.length).toEqual(5);
    expect(firstIter[4].id).toEqual(unix);
    expect(firstIter[0].nextId).toEqual(firstIter[1].id);
    expect(firstIter[1].prevId).toEqual(firstIter[0].id);
    expect(firstIter[1].nextId).toEqual(firstIter[2].id);
    expect(firstIter[2].prevId).toEqual(firstIter[1].id);

    const secondIter = generator.next().value;
    expect(secondIter).not.toEqual(null);
    if (secondIter == null) throw Error();
    expect(secondIter.length).toEqual(5);
    expect(firstIter.slice(1)).toEqual(secondIter.slice(0, 4));
  });
});
