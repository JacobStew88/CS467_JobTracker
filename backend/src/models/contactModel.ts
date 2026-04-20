import { pool } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Contact interface
export interface Contact extends RowDataPacket {
  contact_id: number; // PK
  user_id: number; // FK
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface JobContact extends Contact {
  relationship_type: string;
}

const CONTACTSTABLE: string = "Contacts";
const JOBCONTACTSTABLE: string = "JobContacts";

/*
@result: ResultSetHeader {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
}
Source: https://sidorares.github.io/node-mysql2/docs/documentation/typescript-examples
*/

/* -- CRUD QUERIES FOR CONTACTS: -- */

// Create a new contact
export const createContact = async (contact: Contact): Promise<Contact> => {
  const [content] = await pool.query<ResultSetHeader>(
    `INSERT INTO ${CONTACTSTABLE} (user_id, first_name, last_name, email, phone, notes) VALUES (?, ?, ?, ?, ?, ?)`,
    [contact.user_id, contact.first_name, contact.last_name, contact.email, contact.phone, contact.notes]
  );

  return { ...contact, contact_id: content.insertId };
};

// Get all contacts for a user
export const getContacts = async (user_id: Contact["user_id"]): Promise<Contact[]> => {
  const [content] = await pool.query<Contact[]>(
    `SELECT * FROM ${CONTACTSTABLE} WHERE user_id = ?`,
    [user_id]
  );
  return content;
};

// Get a contact by contact_id
export const getContactById = async (user_id: Contact["user_id"], contact_id: Contact["contact_id"]): Promise<Contact | null> => {
  const [content] = await pool.query<Contact[]>(
    `SELECT * FROM ${CONTACTSTABLE} WHERE user_id = ? AND contact_id = ?`,
    [user_id, contact_id]
  );
  return content.length > 0 ? content[0] : null;
};

// Update a contact
export const updateContact = async (contact: Contact): Promise<boolean> => {
  const [content] = await pool.query<ResultSetHeader>(
    `UPDATE ${CONTACTSTABLE} SET first_name = ?, last_name = ?, email = ?, phone = ?, notes = ? WHERE contact_id = ? AND user_id = ?`,
    [contact.first_name, contact.last_name, contact.email, contact.phone, contact.notes, contact.contact_id, contact.user_id]
  );
  return content.affectedRows > 0;
};

// Delete a contact
export const deleteContact = async (user_id: Contact["user_id"], contact_id: Contact["contact_id"]): Promise<boolean> => {
  const [content] = await pool.query<ResultSetHeader>(
    `DELETE FROM ${CONTACTSTABLE} WHERE contact_id = ? AND user_id = ?`,
    [contact_id, user_id]
  );

  return content.affectedRows > 0;
};

/* -- Creating the many to many link between contacts and jobs: -- */

// Assign a contact to a job / job to a contact
export const assignContactToJob = async (job_id: number, contact_id: number, relationship_type: string): Promise<boolean> => {
  const [content] = await pool.query<ResultSetHeader>(
    `INSERT INTO ${JOBCONTACTSTABLE} (job_id, contact_id, relationship_type) VALUES (?, ?, ?)`,
    [job_id, contact_id, relationship_type]
  );

  return content.affectedRows > 0;
};

// Remove a contact from a job / job from a contact
export const removeContactFromJob = async (job_id: number, contact_id: Contact["contact_id"]): Promise<boolean> => {
  const [content] = await pool.query<ResultSetHeader>(
    `DELETE FROM ${JOBCONTACTSTABLE} WHERE job_id = ? AND contact_id = ?`,
    [job_id, contact_id]
  );

  return content.affectedRows > 0;
};

// Get contacts from a specific job
export const getContactsFromJob = async (job_id: number, user_id: number): Promise<JobContact[]> => {
  const [content] = await pool.query<JobContact[]>(
    `SELECT c.contact_id, c.user_id, c.first_name, c.last_name, c.email, c.phone, jc.relationship_type
     FROM ${CONTACTSTABLE} c
     INNER JOIN ${JOBCONTACTSTABLE} jc ON c.contact_id = jc.contact_id
     WHERE jc.job_id = ? AND c.user_id = ?`,
    [job_id, user_id]
  );

  return content;
};