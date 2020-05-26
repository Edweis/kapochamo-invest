import { sendEmail } from '../../services/aws/sns';
import { BinanceInfoRaw } from '../../types';

export const watcherReportTemplate = async (
  info: BinanceInfoRaw,
  symbols: string[]
) => {
  let message = 'A new news was published :';
  message += JSON.stringify(info, null, '\t');
  message += '\n';
  message += `Traded on ${symbols.join(', ')}`;
  await sendEmail(message);
};
