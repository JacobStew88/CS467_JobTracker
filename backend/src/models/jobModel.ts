import { pool } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Job interface
export interface Job extends RowDataPacket {
  job_id: number; // PK
  user_id: number; // FK
  company_name: string;
  job_title: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  application_date: Date;
}

export type NewJob = Omit<Job, 'job_id'>;
const JOBSTABLE: string = "Jobs";

/* -- CRUD QUERIES FOR JOBS: -- */
// Create a new job
export const createJob = async (job: NewJob): Promise<Job> => {
  const [content] = await pool.query<ResultSetHeader>(
    `INSERT INTO ${JOBSTABLE} (user_id, company_name, job_title, status, application_date) VALUES (?, ?, ?, ?, ?)`,
    [job.user_id, job.company_name, job.job_title, job.status, job.application_date]
  );
    return { ...job, job_id: content.insertId } as Job;
};

// Get all jobs for a user
export const getJobs = async (user_id: Job["user_id"]): Promise<Job[]> => {
  const [content] = await pool.query<Job[]>(
    `SELECT * FROM ${JOBSTABLE} WHERE user_id = ?`,
    [user_id]
    );
    return content;
};

// Get a job by job_id
export const getJobById = async (user_id: Job["user_id"], job_id: Job["job_id"]): Promise<Job | null> => {
  const [content] = await pool.query<Job[]>(
    `SELECT * FROM ${JOBSTABLE} WHERE user_id = ? AND job_id = ?`,
    [user_id, job_id]
  );
  return content.length > 0 ? content[0] : null;
};

// Update a job
export const updateJob = async (job: Job): Promise<boolean> => {
  const [content] = await pool.query<ResultSetHeader>(
    `UPDATE ${JOBSTABLE} SET company_name = ?, job_title = ?, status = ?, application_date = ? WHERE job_id = ? AND user_id = ?`,
    [job.company_name, job.job_title, job.status, job.application_date, job.job_id, job.user_id]
    );
    return content.affectedRows > 0;
};

// Delete a job
export const deleteJob = async (user_id: Job["user_id"], job_id: Job["job_id"]): Promise<boolean> => {
  const [content] = await pool.query<ResultSetHeader>(
    `DELETE FROM ${JOBSTABLE} WHERE job_id = ? AND user_id = ?`,
    [job_id, user_id]
  );
  return content.affectedRows > 0;
};

