import _ from 'lodash';
import { TITLE_PATH } from '../inspector';
/* eslint-disable-next-line prettier/prettier */
export const MOCK_REAL_API_RESPONSES = {"code":"000000","message":null,"messageDetail":null,"data":{"latestArticles":[{"id":29720,"code":"a82a5611550948d6984c284f395f1cba","title":"USDC and ERD Added to Savings Products on Binance","body":null,"type":1,"catalogId":49,"catalogName":"Latest News","publishDate":1596794163978},{"id":29692,"code":"9ec2b8c10c2447c5b42c2a15e6580dba","title":"The BUSD Trading Activity Has Now Concluded","body":null,"type":1,"catalogId":49,"catalogName":"Latest News","publishDate":1596772022351},{"id":29683,"code":"bdbe0ac78e2e475ca72c5a99610bda28","title":"Binance Staking Launches Locked Staking Support for LTO. Receive Annualized Interest Rate of up to 10%","body":null,"type":1,"catalogId":49,"catalogName":"Latest News","publishDate":1596717189972},{"id":29676,"code":"2816e153fe36411fa39b34247db77db0","title":"Binance Lists Balancer (BAL)","body":null,"type":1,"catalogId":48,"catalogName":"New Crypto Listings","publishDate":1596713087058},{"id":29674,"code":"66607f4c63e748568f503fcbd8f08965","title":"Release of P2P Trading Advertising Index Price Strategy","body":null,"type":2,"catalogId":2,"catalogName":"Deposit/Withdrawal","publishDate":1596706464254}]},"success":true};

const copyRealReponse = _.cloneDeep(MOCK_REAL_API_RESPONSES);
_.set(copyRealReponse, TITLE_PATH, 'Awesome title');

export const MOCK_FAKE_API_RESPONSES = copyRealReponse;
