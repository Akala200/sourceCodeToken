import { Router } from 'express';
// eslint-disable-next-line import/no-named-as-default
import WalletController from '../controllers/WalletController';
import verifyNumber from '../middlewares/verifyNumber';

// const { decodeRegToken } = require('../utils/storeToken');

const router = Router();

const {
  initiate,
  webhook,
  transactionHistory,
  balanceBTC,
  balanceETH,
  balanceBCH,
  nairaBalance,
  transactionHistoryAll,
  callback,
  convert,
  coinPrice,
  allWallet,
  send,
  getBank,
  addBank,
  getUserBank,
  createTest,
  withdraw,
  convertTransfer,
  convertSale,
  convertTransferETH,
  convertTransferBCH,
  convertSaleETH,
  convertSaleBCH,
  nairaBalanceETH,
  nairaBalanceBCH,
} = WalletController;
const { numberChecker } = verifyNumber;

router.post('/credit', numberChecker, initiate);
router.post('/send', send);
router.post('/withdraw', withdraw);
router.post('/webhook', numberChecker, webhook);
router.get('/history', transactionHistory);
router.get('/history/all', transactionHistoryAll);
router.get('/balance/coin', balanceBTC);
router.get('/balance/eth', balanceETH);
router.get('/balance/bch', balanceBCH);
router.get('/balance/naira', nairaBalance);
router.get('/balance/eth/naira', nairaBalanceETH);
router.get('/balance/bch/naira', nairaBalanceBCH);
router.get('/callback', callback);
router.get('/convert', convert);
router.get('/convert/sale', convertSale);
router.get('/transfer/convert', convertTransfer);
router.get('/sell/convert', convertTransfer);
router.get('/eth/transfer/convert', convertTransferETH);
router.get('/dodge/transfer/convert', convertTransferBCH);
router.get('eth/convert/sale', convertSaleETH);
router.get('bch/convert/sale', convertSaleBCH);

router.get('/eth/sell/convert', convertTransferETH);
router.get('/bch/sell/convert', convertTransferBCH);
router.get('/get/coin', coinPrice);
router.get('/wallet/all', allWallet);
router.get('/get/bank', getBank);
router.post('/add/bank', addBank);
router.get('/user/bank', getUserBank);
router.get('/test', createTest);


export default router;
