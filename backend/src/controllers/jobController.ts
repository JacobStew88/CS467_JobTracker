import { Request, Response } from 'express';
import { Job, NewJob, createJob, getJobById, updateJob, deleteJob, getJobs, isJobStatus } from '../models/jobModel.js';
import { JWTUserPayload } from '../types/auth.js';
import { withErrorHandling } from './controllerWrapper.js';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

type CreateJobInput = Omit<NewJob, 'user_id'>;

export type ValidationResult<T> = 
  | { ok: false; error: string }
  | { ok: true; data: T };

function validateJobBody(req: Request, isPartial: true): ValidationResult<Partial<CreateJobInput>>;
function validateJobBody(req: Request, isPartial?: false): ValidationResult<CreateJobInput>;
function validateJobBody(req: Request, isPartial: boolean = false): ValidationResult<Partial<CreateJobInput> | CreateJobInput> {
    const { company_name, job_title, status, application_date } = req.body;
    
    const data: Partial<CreateJobInput> = {};
    if (!isPartial) {
        if (company_name === undefined) return { ok: false, error: "Missing company name" };
        if (job_title === undefined) return { ok: false, error: "Missing job title" };
        if (status === undefined) return { ok: false, error: "Missing status" };
        if (application_date === undefined) return { ok: false, error: "Missing application date" };
    }
    // --- Validate Company Name ---
    if (company_name !== undefined) {
        if (typeof company_name !== 'string') return { ok: false, error: "Invalid company name" };
        if (company_name.trim() === '') return { ok: false, error: "Company name cannot be empty" };
        data.company_name = company_name.trim();
    }
    // --- Validate Job Title ---
    if (job_title !== undefined) {
        if (typeof job_title !== 'string') return { ok: false, error: "Invalid job title" };
        if (job_title.trim() === '') return { ok: false, error: "Job title cannot be empty" };
        data.job_title = job_title.trim();
    } 
    // --- Validate Status ---
    if (status !== undefined) {
        if (!isJobStatus(status)) return { ok: false, error: "Invalid status" };
        data.status = status;
    }
    // --- Validate Date ---
    if (application_date !== undefined) {
        if (!validateDate(application_date)) return { ok: false, error: "Invalid application date" };
        data.application_date = new Date(application_date);
    }
    // Prevent empty partial updates
    if (isPartial && Object.keys(data).length === 0) {
        return { ok: false, error: "No valid fields provided for update" };
    }
    // Return the data (TypeScript handles the narrowing via overloads)
    return { 
        ok: true, 
        data: isPartial ? data : (data as CreateJobInput) 
    };
}

const validateDate = (date: any): boolean => {
    if (typeof date !== 'string' || date.trim() === '') return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
}

const validateLimitAndOffsetRangeValues = (limit: number, offset: number): boolean => {
    return limit >= 1 && offset >= 0 && limit <= MAX_LIMIT;
}

export const createJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    // Getting payload from the token via passport middleware
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;

    const validJobBody = validateJobBody(req, false);
    if (!validJobBody.ok) {
        res.status(400).json({ error: validJobBody.error });
        return;
    }
    // Create the job
    const job: Job = await createJob({
        user_id: userid,
        ...validJobBody.data
    });
    res.status(201).json(job);
});

export const getJobsController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    // If limit and offset are not numbers, it will set to the default values
    const parsedLimit = parseInt(req.query.limit as string, 10);
    const parsedOffset = parseInt(req.query.offset as string, 10);
    const limit = parsedLimit || DEFAULT_LIMIT;
    const offset = parsedOffset || DEFAULT_OFFSET;
    // Validate the limit and offset
    const validLimitAndOffset = validateLimitAndOffsetRangeValues(limit, offset);
    if (!validLimitAndOffset) {
        res.status(400).json({ error: "Invalid limit or offset parameters"});
        return;
    }
    // Get the jobs
    const jobs: Job[] = await getJobs(userid, limit, offset);
    res.status(200).json(jobs);
});

export const getJobByIdController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const jobid = parseInt(req.params.id as string, 10);

    // Validate the job id
    if (isNaN(jobid)) { res.status(400).json({ error: "Invalid job id" }); return; }

    const job: Job | null = await getJobById(userid, jobid);
    if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
    }
    res.status(200).json(job);
});

export const updateJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const jobid = parseInt(req.params.id as string, 10);

    if (isNaN(jobid)) { 
        res.status(400).json({ error: "Invalid job id" }); 
        return; 
    }

    const validation = validateJobBody(req, true);
    if (!validation.ok) {
        console.log("Validation Failed for PUT /jobs/:id ->", validation.error);
        console.log("Incoming Body ->", req.body);
        res.status(400).json({ error: validation.error });
        return;
    }

    const existingJob: Job | null = await getJobById(userid, jobid);
    if (!existingJob) {
        res.status(404).json({ error: "Job not found" });
        return;
    }

    const updatedJob: Job = {
        ...existingJob,
        ...validation.data 
    };
    const success = await updateJob(updatedJob);
    if (!success) {
        res.status(500).json({ error: "Failed to update job" });
        return;
    }   
    
    res.status(200).json(updatedJob);
});

export const deleteJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const jobid = parseInt(req.params.id as string, 10);

    // Validate the job id
    if (isNaN(jobid)) { res.status(400).json({ error: "Invalid job id" }); return; }

    const existingJob: Job | null = await getJobById(userid, jobid);
    if (!existingJob) {
        res.status(404).json({ error: "Job not found" });
        return;
    }
    const success = await deleteJob(userid, jobid);
    if (!success) {
        res.status(500).json({ error: "Failed to delete job" });
        return;
    }   
    res.status(200).json({ message: "Job deleted successfully" });
});