import { Request, Response } from 'express';
import { Contact, JobContact, NewContact, createContact, getContactById,
         updateContact, deleteContact, getContacts, 
         assignContactToJob, removeContactFromJob, getContactsFromJob } from '../models/contactModel.js';
import { JWTUserPayload } from '../types/auth.js';
import { withErrorHandling } from './controllerWrapper.js';
import validator from 'validator';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

type ValidationResult = 
  | { ok: false; error: string }
  | { ok: true; data: Partial<Contact> }; 

const validateContactBody = (req: Request): ValidationResult => {
    const { first_name, last_name, email, phone, notes } = req.body;
    const data: Partial<Contact> = {};

    if (first_name === undefined) return { ok: false, error: "Missing first name" };
    if (typeof first_name !== 'string') return { ok: false, error: "Invalid first name format" };
    const trimmedFirst = first_name.trim();
    if (trimmedFirst === '') return { ok: false, error: "First name cannot be empty" };
    data.first_name = trimmedFirst;

    if (last_name !== undefined) {
        if (typeof last_name !== 'string') return { ok: false, error: "Invalid last name format" };
        const trimmedLast = last_name.trim();
        if (trimmedLast === '') return { ok: false, error: "Last name cannot be empty" };
        data.last_name = trimmedLast;
    }

    if (email !== undefined) {
        if (typeof email !== 'string') return { ok: false, error: "Invalid email format" };
        const trimmedEmail = email.trim().toLowerCase();
        if (!validator.isEmail(trimmedEmail)) return { ok: false, error: "Invalid email" };
        data.email = trimmedEmail;
    }

    if (phone !== undefined) {
        if (typeof phone !== 'string') return { ok: false, error: "Invalid phone format" };
        const trimmedPhone = phone.trim();
        if (trimmedPhone === '') return { ok: false, error: "Phone cannot be empty" };
        if (!validator.isMobilePhone(trimmedPhone, 'any')) return { ok: false, error: "Invalid phone number" };
        data.phone = trimmedPhone;
    }

    if (notes !== undefined) {
        if (typeof notes !== 'string') return { ok: false, error: "Invalid notes format" };
        data.notes = notes.trim();
    }

    return { ok: true, data };
};

const validateLimitAndOffsetRangeValues = (limit: number, offset: number): boolean => {
    return limit >= 1 && offset >= 0 && limit <= MAX_LIMIT;
}

export const createContactController = withErrorHandling(async (req: Request, res: Response): Promise<void> =>{
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;

    const validContactBody = validateContactBody(req);
    if (!validContactBody.ok) {
        res.status(400).json({ error: validContactBody.error });
        return;
    }

    const contactData = { 
        user_id: userid,
        ...validContactBody.data
     } as NewContact;

    const newContact = await createContact(contactData);
    res.status(201).json(newContact);
});

export const getContactByIdController = withErrorHandling(async (req : Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const contact_id = parseInt(req.params.id as string, 10);

    if (isNaN(contact_id)) { res.status(400).json({ error: "Invalid contact id" }); return; }

    const contact = await getContactById(userid, contact_id);
    if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
    }

    res.status(200).json(contact);
});

export const getContactsController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const parsedLimit = parseInt(req.query.limit as string, 10);
    const parsedOffset = parseInt(req.query.offset as string, 10);
    const limit = parsedLimit || DEFAULT_LIMIT;
    const offset = parsedOffset || DEFAULT_OFFSET;

    const validLimitAndOffset = validateLimitAndOffsetRangeValues(limit, offset);
    if (!validLimitAndOffset) {
        res.status(400).json({ error: "Invalid limit or offset parameters"});
        return;
    }

    const contacts: Contact[] | null = await getContacts(userid, limit, offset);
    res.status(200).json(contacts);
})

export const updateContactController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const contactid = parseInt(req.params.id as string, 10);

    if (isNaN(contactid)) { res.status(400).json({ error: "Invalid contact id" }); return; }

    const existingContact: Contact | null = await getContactById(userid, contactid);
    if (!existingContact) {
        res.status(404).json({ error: "Contact not found" });
        return;
    }

    if (req.body.first_name === undefined) {
        req.body.first_name = existingContact.first_name;
    }

    const validation = validateContactBody(req);
    if (!validation.ok) {
        res.status(400).json({ error: validation.error });
        return;
    }

    const updatedContact = {
        ...existingContact,
        ...validation.data
    }

    const success = await updateContact(updatedContact);
    if (!success) {
        res.status(500).json({ error: "Failed to update contact" });
        return;
    }

    res.status(200).json(updatedContact);
});

export const deleteContactController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const contactid = parseInt(req.params.id as string, 10);

    if (isNaN(contactid)) { res.status(400).json({ error: "Invalid contact id" }); return; }

    const existingContact: Contact | null = await getContactById(userid, contactid);
    if (!existingContact) {
        res.status(404).json({ error: "Contact not found" });
        return;
    }
    const success = await deleteContact(userid, contactid);
    if (!success) {
        res.status(500).json({ error: "Failed to delete contact" });
        return;
    }
    res.status(200).json({ message: "Contact deleted successfully" });
});

export const assignContactToJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const jobid = parseInt(req.params.jobId as string, 10);
    const contactid = parseInt(req.params.contactId as string, 10);
    const { relationship_type } = req.body;

    if (relationship_type === undefined || typeof relationship_type !== 'string' || relationship_type.trim() === '') {
        res.status(400).json({ error: "Invalid or missing relationship type" });
        return;
    }
    const trimmedRelationshipType = relationship_type.trim();

    const success = await assignContactToJob(jobid, contactid, trimmedRelationshipType);
    if (!success) {
        res.status(500).json({ error: "Failed to assign contact to job" });
        return;
    }
    res.status(200).json({ message: "Contact assigned to job successfully" });
});

export const removeContactFromJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const jobid = parseInt(req.params.jobId as string, 10);
    const contactid = parseInt(req.params.contactId as string, 10);

    const success = await removeContactFromJob(jobid, contactid);
    if (!success) {
        res.status(500).json({ error: "Failed to remove contact from job" });
        return;
    }
    res.status(200).json({ message: "Contact removed from job successfully" });
});

export const getContactsFromJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const jobid = parseInt(req.params.jobId as string, 10);

    if (isNaN(jobid)) { res.status(400).json({ error: "Invalid job id" }); return; }

    const contacts: JobContact[] = await getContactsFromJob(jobid);
    res.status(200).json(contacts);
});