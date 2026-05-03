import * as authController from "../controllers/authController";
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', authController.userLogin);
authRouter.post('/create-account', authController.userCreateAccount);
authRouter.post('/forgot-password', authController.userForgotPassword);
authRouter.post('/reset-password', authController.userResetPassword);

export default authRouter;