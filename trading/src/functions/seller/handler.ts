import Follower from './follower';
import { RACE_ACTION, waitForAction } from './waitToSell';
import { sendEmail } from '../../services/aws/sns';
import { sendOrder } from '../../services/binance';
import { buildReport } from './buildReport';
import { insertTransaction } from '../../services/aws/dynamoDb';
import { getVariation, parseMessage } from './helpers';
import { sendToSeller } from '../../services/aws/sqs';
import { POSTPONE_TIME } from '../../constants';

const seller: Function = async (event: AWSLambda.SQSEvent) => {
  try {
    const { buyResponse, tries, highest } = parseMessage(event);
    console.debug({ buyResponse, tries, highest });
    const { symbol } = buyResponse;
    const buyBaseQuantity = buyResponse.origQty;

    const strategy = new Follower(0.02);
    if (highest) strategy.highest = highest;
    const raceWinner = await waitForAction(strategy, symbol);
    if (raceWinner === RACE_ACTION.POSTPONE && tries > 0) {
      // postpone
      const { highest } = strategy;
      const message = { buyResponse, tries: tries - 1, highest };
      return sendToSeller(message, POSTPONE_TIME);
    }

    // Sell and log
    const sellRequest = await sendOrder('SELL', symbol, buyBaseQuantity);
    const variation = getVariation(buyResponse, sellRequest.data);
    await insertTransaction(sellRequest.data, variation);
    const report = await buildReport(buyResponse, sellRequest.data);
    return sendEmail(report);
  } catch (error) {
    await sendEmail(JSON.stringify(error, null, '\t'));
    throw error;
  }
};

export default seller;
