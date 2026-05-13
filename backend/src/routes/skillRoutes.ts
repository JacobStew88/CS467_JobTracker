import * as skillController from '../controllers/skillController.js';
import { Router } from 'express';

const skillRouter = Router();

skillRouter.post('/', skillController.createSkillController);
skillRouter.get('/', skillController.getSkillsController);
skillRouter.get('/:id', skillController.getSkillController);
skillRouter.put('/:id', skillController.updateSkillController);
skillRouter.delete('/:id', skillController.deleteSkillController);
skillRouter.post('/:id/jobs/:jobid', skillController.assignSkillToJobController);
skillRouter.delete('/:id/jobs/:jobid', skillController.removeSkillFromJobController);
skillRouter.get('/jobs/:jobid', skillController.getSkillsFromJobController);

export default skillRouter;