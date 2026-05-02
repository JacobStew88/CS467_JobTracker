import { Request, Response } from 'express';
import { Job, NewJob, createJob, getJobById, updateJob, deleteJob, getJobs, isJobStatus } from '../models/jobModel';
import { JWTUserPayload } from '../types/auth';

const ERROR_SERVER = {error: "Server Error"}
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

type ValidationResult = 
  | { ok: false; error: string }
  | { ok: true; data: NewJob};

const validateJobRequest = (req: Request): ValidationResult => {
    const { company_name, job_title, status, application_date } = req.body;
    if (!company_name || typeof company_name !== 'string') return { ok: false, error: "Missing or invalid company name" };
    if (!job_title || typeof job_title !== 'string') return { ok: false, error: "Missing or invalid job title" };
    if (!status || !isJobStatus(status)) return { ok: false, error: "Missing or invalid status" };
    if (!application_date || !validateDate(application_date)) return { ok: false, error: "Missing or invalid date" };

    return { 
        ok: true, 
        data: {
        company_name,
        job_title,
        status,
        application_date: new Date(application_date)
    } as NewJob }
};

const validateDate = (date: string): boolean => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
}

const validateLimitAndOffsetRangeValues = (limit: number, offset: number): boolean => {
    return limit >= 1 && offset >= 0 && limit <= MAX_LIMIT;
}

export const createJobController = async (req: Request, res: Response): Promise<void> => {
    // Getting payload from the token via passport middleware
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;

    const validJobBody = validateJobRequest(req);
    if (!validJobBody.ok) {
        res.status(400).json(validJobBody.error);
        return;
    }
    // Create the job
    try {
        const job: Job = await createJob({
        user_id: userid,
        company_name: validJobBody.data.company_name,
        job_title: validJobBody.data.job_title,
        status: validJobBody.data.status,
        application_date: validJobBody.data.application_date
    } as NewJob);
        res.status(201).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json(ERROR_SERVER);
    }
};

export const getJobsController = async (req: Request, res: Response): Promise<void> => {
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
    try {
        const jobs: Job[] = await getJobs(userid, limit, offset);
        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json(ERROR_SERVER);
    }
}

export const getJobByIdController = async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const jobid = parseInt(req.params.id as string, 10);

    // Validate the job id
    if (isNaN(jobid)) { res.status(400).json({ error: "Invalid job id" }); return; }

    try {
        const job: Job | null = await getJobById(userid, jobid);
        if (!job) {
            res.status(404).json({ error: "Job not found" });
            return;
        }
        res.status(200).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json(ERROR_SERVER);
    }
}

export const updateJobController = async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const jobid = parseInt(req.params.id as string, 10);

    // Validate the application date and job id
    if (req.body.application_date && !validateDate(req.body.application_date)) {
        res.status(400).json({ error: "Invalid date" });
        return;
    }
    // Validate the job id
    if (isNaN(jobid)) { res.status(400).json({ error: "Invalid job id" }); return; }
    // Validate status
    if (req.body.status && !isJobStatus(req.body.status)) {
        res.status(400).json({ error: "Invalid status" });
        return;
    }
    try {
        const existingJob: Job | null = await getJobById(userid, jobid);
        if (!existingJob) {
            res.status(404).json({ error: "Job not found" });
            return;
        }
        const updatedJob = {
            job_id: jobid,
            user_id: userid,
            company_name: req.body.company_name || existingJob.company_name,
            job_title: req.body.job_title || existingJob.job_title,
            status: req.body.status || existingJob.status,
            application_date: req.body.application_date ? new Date(req.body.application_date) : existingJob.application_date
        } as Job;
        const success = await updateJob(updatedJob);
        if (!success) {
            res.status(500).json({ error: "Failed to update job" });
            return;
        }   
        res.status(200).json(updatedJob);
    } catch (error) {
        console.error(error);
        res.status(500).json(ERROR_SERVER);
    }   
}

export const deleteJobController = async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const jobid = parseInt(req.params.id as string, 10);

    // Validate the job id
    if (isNaN(jobid)) { res.status(400).json({ error: "Invalid job id" }); return; }

    try {
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
    } catch (error) {
        console.error(error);
        res.status(500).json(ERROR_SERVER);
    }   
}