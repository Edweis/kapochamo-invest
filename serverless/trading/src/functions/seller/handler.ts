import Follower from './follower';
import { waitToSell, RACE_ACTION, waitTimeout } from './waitToSell';
import { sendEmail } from '../../services/aws/sns';
import { sendOrder } from '../../services/binance';
import { buildReport } from './buildReport';
import { insertTransaction } from '../../services/aws/dynamoDb';
import { getVariation, parseMessage } from './helpers';
import { sendToSeller } from '../../services/aws/sqs';
import { TIMEOUT, POSTPONE_TIME } from '../../constants';

const seller: Function = async (event: AWSLambda.SQSEvent) => {
  try {
    const { buyResponse, postponeTriesLeft } = parseMessage(event);
    const { symbol } = buyResponse;
    const buyBaseQuantity = buyResponse.origQty;

    const strategy = new Follower(0.02);
    const raceWinner: RACE_ACTION = await Promise.race([
      waitTimeout(TIMEOUT),
      waitToSell(strategy, symbol),
    ]);
    if (raceWinner === RACE_ACTION.POSTPONE && postponeTriesLeft > 0) {
      // postpone
      await sendEmail(`Selling of ${symbol} is postponed.`);
      const message = { buyResponse, postponeTriesLeft: postponeTriesLeft + 1 };
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
