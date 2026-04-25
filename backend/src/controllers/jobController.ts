import { Request, Response } from 'express';
import { Job, NewJob, createJob, getJobById, updateJob, deleteJob } from '../models/jobModel';
import { JWTUserPayload } from '../types/auth';

const ERROR_SERVER = {error: "Server Error"}

export const createJobController = async (req: Request, res: Response): Promise<void> => {
    // Getting payload from the token via passport middleware
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;

    // Request body from user
    const { company_name, job_title, status, application_date } = req.body;

    // Validation
    if (!company_name || !job_title || !status || !application_date) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    const validStatuses = ["applied", "waiting to hear back", "interviewed", "decision"];
    if (!validStatuses.includes(status)) {
        res.status(400).json({ error: "Invalid status value" });
        return;
    }
    const parsedDate = new Date(application_date);
    if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: "Invalid application_date format" });
        return;
    }

    // Create the job
    try {
        const job: Job = await createJob({
        user_id: userid,
        company_name: company_name,
        job_title: job_title,
        status: status,
        application_date: parsedDate
    } as NewJob);
        res.status(201).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json(ERROR_SERVER);
    }
};

