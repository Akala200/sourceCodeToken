import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

const { login, newUser } = UserController;

router.post('/create/account', newUser);
router.post('/login', login);

export default router;
