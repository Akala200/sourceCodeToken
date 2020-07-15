import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

const { login, newUser, verify } = UserController;

router.post('/create/account', newUser);
router.post('/login', login);
router.post('/verify', verify);

export default router;
