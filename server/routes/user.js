import { Router } from 'express';
import UserController from '../controllers/UserController';
const {auth} = require('../middlewares/authMiddleware')

const router = Router();

const {
  login,
  newUser,
  verify,
  getlist,
  bitcoin,
  shortlist,
  updateUser,
  getUser,
  bitcoinMobile,
  bitcoinMobileNgn,
  bitcoinMobileUsd,
  bitcoinMobileMarketBTC,
  bitcoinMobileMarketXRP,
  bitcoinMobileMarketUSDT,
  bitcoinMobileMarketETH,
} = UserController;

router.post('/create/account', newUser);
router.post('/login', login);
router.post('/verify', verify);
router.get('/lists', auth, getlist);
router.get('/mobile', auth, bitcoinMobile);
router.get('/coin/history', auth, bitcoinMobileNgn);
router.get('/coin/history/usd', auth, bitcoinMobileUsd);
router.get('/coin/market/btc', auth, bitcoinMobileMarketBTC);
router.get('/coin/market/xrp', auth, bitcoinMobileMarketXRP);
router.get('/coin/market/sudt', auth, bitcoinMobileMarketUSDT);
router.get('/coin/market/eth', auth, bitcoinMobileMarketETH);


router.get('/get/user', getUser);
router.put('/update/user', updateUser);
router.get('/bitcoin', bitcoin);
router.get('/shortlist', shortlist);

// bitcoin
export default router;
