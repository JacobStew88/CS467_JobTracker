import * as userController from '../controllers/userController';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', userController.getUserController);
userRouter.put('/', userController.updateUserController);
userRouter.delete('/', userController.deleteUserController);

export default userRouter;