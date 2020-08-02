import { Router } from 'express';
import WalletController from '../controllers/WalletController';
import verifyNumber from '../middlewares/verifyNumber';

const router = Router();

const { initiate, webhook, transactionHistory } = WalletController;
const { numberChecker } = verifyNumber;

router.post('/credit', numberChecker, initiate);
router.post('/webhook', numberChecker, webhook);
router.get('/history', transactionHistory);


export default router;
