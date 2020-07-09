import { Router } from 'express';
import WalletController from '../controllers/WalletController';
import verifyNumber from '../middlewares/verifyNumber';

const router = Router();

const { newWallet } = WalletController;
const { numberChecker } = verifyNumber;

router.post('/createwallet', numberChecker, newWallet);

export default router;
