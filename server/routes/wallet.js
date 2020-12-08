import { Router } from 'express';
import WalletController from '../controllers/WalletController';
import verifyNumber from '../middlewares/verifyNumber';

// const { decodeRegToken } = require('../utils/storeToken');

const router = Router();

const {
  initiate,
  webhook,
  transactionHistory,
  balance,
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
} = WalletController;
const { numberChecker } = verifyNumber;

router.post('/credit', numberChecker, initiate);
router.post('/send', send);
router.post('/transfer', withdraw);
router.post('/webhook', numberChecker, webhook);
router.get('/history', transactionHistory);
router.get('/history/all', transactionHistoryAll);
router.get('/balance/coin', balance);
router.get('/balance/naira', nairaBalance);
router.get('/callback', callback);
router.get('/convert', convert);
router.get('/get/coin', coinPrice);
router.get('/wallet/all', allWallet);
router.get('/get/bank', getBank);
router.post('/add/bank', addBank);
router.get('/user/bank', getUserBank);
router.get('/test', createTest);


export default router;
