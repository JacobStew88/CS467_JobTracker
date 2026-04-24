import * as jobController from '../controllers/jobController';
import { Router } from 'express';

const jobRouter = Router();

jobRouter.post('/', jobController.createJobController);

export default jobRouter;