import { Router } from 'express';
import WalletController from '../controllers/WalletController';
import verifyNumber from '../middlewares/verifyNumber';

const router = Router();

const {
  initiate,
  webhook,
  transactionHistory,
  balance,
  nairaBalance,
  transactionHistoryAll,
  callback,
  convert
} = WalletController;
const { numberChecker } = verifyNumber;

router.post('/credit', numberChecker, initiate);
router.post('/webhook', numberChecker, webhook);
router.get('/history', transactionHistory);
router.get('/history/all', transactionHistoryAll);
router.get('/balance/coin', balance);
router.get('/balance/naira', nairaBalance);
router.get('/callback', callback);
router.get('/convert', convert);


export default router;
