import { Router } from 'express';
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
  balanceDoge,
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
  convertSaleDOGE,
  nairaBalanceETH,
  nairaBalanceDOGE,
  getWallet,
} = WalletController;
const { numberChecker } = verifyNumber;

router.post('/credit', numberChecker, initiate);
router.post('/send', send);
router.post('/withdraw', withdraw);
router.post('/webhook', numberChecker, webhook);
router.get('/history', transactionHistory);
router.get('/get/wallet', getWallet);
router.get('/history/all', transactionHistoryAll);
router.get('/balance/coin', balanceBTC);
router.get('/balance/eth', balanceETH);
router.get('/balance/doge', balanceDoge);
router.get('/balance/naira', nairaBalance);
router.get('/balance/eth/naira', nairaBalanceETH);
router.get('/balance/doge/naira', nairaBalanceDOGE);
router.get('/callback', callback);
router.get('/convert', convert);
router.get('/convert/sale', convertSale);
router.get('/transfer/convert', convertTransfer);
router.get('/sell/convert', convertTransfer);
router.get('/eth/transfer/convert', convertTransferETH);
router.get('/dodge/transfer/convert', convertTransferBCH);
router.get('eth/convert/sale', convertSaleETH);
router.get('doge/convert/sale', convertSaleDOGE);

router.get('/eth/sell/convert', convertTransferETH);
router.get('/doge/sell/convert', convertTransferBCH);
router.get('/get/coin', coinPrice);
router.get('/wallet/all', allWallet);
router.get('/get/bank', getBank);
router.post('/add/bank', addBank);
router.get('/user/bank', getUserBank);
router.get('/test', createTest);

export default router;
