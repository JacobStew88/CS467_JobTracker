import * as authController from "../controllers/authController";
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', authController.userLogin);
authRouter.post('/create-account', authController.userCreateAccount);

export default authRouter;