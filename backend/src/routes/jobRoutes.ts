import * as jobController from '../controllers/jobController.js';
import { Router } from 'express';

const jobRouter = Router();

jobRouter.post('/', jobController.createJobController);
jobRouter.get('/', jobController.getJobsController);
jobRouter.get('/:id', jobController.getJobByIdController);
jobRouter.put('/:id', jobController.updateJobController);
jobRouter.delete('/:id', jobController.deleteJobController);

export default jobRouter;