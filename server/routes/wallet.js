import { Router } from 'express';
import WalletController from '../controllers/WalletController';
import verifyNumber from '../middlewares/verifyNumber';

const { decodeRegToken } = require('../utils/storeToken');

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
} = WalletController;
const { numberChecker } = verifyNumber;

router.post('/credit', decodeRegToken, numberChecker, initiate);
router.post('/send', decodeRegToken, send);
router.post('/webhook', numberChecker, webhook);
router.get('/history', decodeRegToken, transactionHistory);
router.get('/history/all', decodeRegToken, transactionHistoryAll);
router.get('/balance/coin', decodeRegToken, balance);
router.get('/balance/naira', decodeRegToken, nairaBalance);
router.get('/callback', decodeRegToken, callback);
router.get('/convert', decodeRegToken, convert);
router.get('/get/coin', decodeRegToken, coinPrice);
router.get('/wallet/all', decodeRegToken, allWallet);
router.get('/get/bank', decodeRegToken, getBank);
router.post('/add/bank', decodeRegToken, addBank);
router.get('/user/bank', decodeRegToken, getUserBank);


export default router;
