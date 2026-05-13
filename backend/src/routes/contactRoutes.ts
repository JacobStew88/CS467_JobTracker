import { Router } from "express";
import * as contactController from "../controllers/contactController.js";

const contactRouter = Router();

contactRouter.post("/", contactController.createContactController);
contactRouter.get("/:id", contactController.getContactByIdController);
contactRouter.get("/", contactController.getContactsController);
contactRouter.get("/job/:jobId", contactController.getContactsFromJobController);
contactRouter.put("/:id", contactController.updateContactController);
contactRouter.delete("/:id", contactController.deleteContactController);
contactRouter.get("/job/:jobId/contact/:contactId", contactController.getContactsFromJobController);
contactRouter.post("/job/:jobId/contact/:contactId", contactController.assignContactToJobController);
contactRouter.delete("/job/:jobId/contact/:contactId", contactController.removeContactFromJobController);

export default contactRouter;