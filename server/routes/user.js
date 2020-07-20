import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

const { login, newUser, verify, getlist } = UserController;

router.post('/create/account', newUser);
router.post('/login', login);
router.post('/verify', verify);
router.get("/lists", getlist);


export default router;
