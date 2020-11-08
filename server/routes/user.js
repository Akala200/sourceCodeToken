import { Router } from 'express';
import UserController from '../controllers/UserController';

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
} = UserController;

router.post('/create/account', newUser);
router.post('/login', login);
router.post('/verify', verify);
router.get('/lists', getlist);
router.get('/mobile', bitcoinMobile);

router.get('/get/user', getUser);
router.put('/update/user', updateUser);
router.get('/bitcoin', bitcoin);
router.get('/shortlist', shortlist);

// bitcoin
export default router;
