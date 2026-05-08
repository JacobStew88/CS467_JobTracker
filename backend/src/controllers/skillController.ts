import { Request, Response } from 'express';
import { Skill, NewSkill, createSkill, getSkill, 
         updateSkill, deleteSkill, getSkills, getSkillsFromJob, 
         assignSkillToJob, removeSkillFromJob } from '../models/skillModel.js';
import { JWTUserPayload } from '../types/auth.js';
import { withErrorHandling } from './controllerWrapper.js';
import { Job, getJobById } from '../models/jobModel.js';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

type CreateSkillInput = Omit<NewSkill, 'user_id'>;

type ValidationResult<T> = 
  | { ok: false; error: string }
  | { ok: true; data: T};

const validComfortLevel = (comfort_level: number): boolean => {
    return comfort_level >= 1 && comfort_level <= 5;
}

function validateSkillBody(req: Request, isPartial: true): ValidationResult<Partial<CreateSkillInput>>;
function validateSkillBody(req: Request, isPartial?: false): ValidationResult<CreateSkillInput>;
function validateSkillBody(req: Request, isPartial: boolean = false): ValidationResult<Partial<CreateSkillInput> | CreateSkillInput> {
    const { skill_name, comfort_level } = req.body;

    
    const data: Partial<CreateSkillInput> = {};
    if (!isPartial) {
        if (skill_name === undefined) return { ok: false, error: "Missing skill name" };
        if (comfort_level === undefined) return { ok: false, error: "Missing comfort level" };
    }

    if (skill_name !== undefined) {
        if (typeof skill_name !== 'string') { return { ok: false, error: "Invalid skill name" }; }
        if (skill_name.trim() === '') { return { ok: false, error: "Skill name cannot be empty" }; }
        data.skill_name = skill_name.trim();
    }
    // Note: 0 is considered false in Javascript
    if (comfort_level !== undefined) {
        if (isNaN(comfort_level) || !validComfortLevel(comfort_level)) return { ok: false, error: "Invalid comfort level" };
        data.comfort_level = comfort_level;
    }

    if (isPartial && Object.keys(data).length === 0) {
        return { ok: false, error: "No valid fields provided for update" };
    }

    return {
        ok: true,
        data: isPartial ? data : (data as CreateSkillInput)
    };
}

const validateLimitAndOffsetRangeValues = (limit: number, offset: number): boolean => {
    return limit >= 1 && offset >= 0 && limit <= MAX_LIMIT;
}

type SkillJobAssignmentValidation =
    | { ok: false; status: number; body: { error: string } }
    | { ok: true; data: { userid: number; skillid: number; jobid: number } };

const validateSkillJobForAssignment = async (req: Request): Promise<SkillJobAssignmentValidation> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const skillid = parseInt(req.params.id as string, 10);
    const jobid = parseInt(req.params.jobid as string, 10);

    if (isNaN(skillid)) return { ok: false, status: 400, body: { error: "Invalid skill id" } };
    if (isNaN(jobid)) return { ok: false, status: 400, body: { error: "Invalid job id" } };
    if (isNaN(userid)) return { ok: false, status: 400, body: { error: "Invalid user id" } };

    const existingSkill: Skill | null = await getSkill(userid, skillid);
    if (!existingSkill) return { ok: false, status: 404, body: { error: "Skill not found" } };

    const existingJob: Job | null = await getJobById(userid, jobid);
    if (!existingJob) return { ok: false, status: 404, body: { error: "Job not found" } };

    return { ok: true, data: { userid, skillid, jobid } };
};

export const createSkillController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;

    const validSkillBody = validateSkillBody(req, false);
    if (!validSkillBody.ok) {
        res.status(400).json({error: validSkillBody.error});
        return;
    }

    const newSkill: NewSkill = {
        user_id: userid,
        skill_name: validSkillBody.data.skill_name,
        comfort_level: validSkillBody.data.comfort_level
    };
    const skill: Skill = await createSkill(newSkill);
    res.status(201).json(skill);

});

export const getSkillsController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;


    const parsedLimit = parseInt(req.query.limit as string, 10);
    const parsedOffset = parseInt(req.query.offset as string, 10);
    const limit = parsedLimit || DEFAULT_LIMIT;
    const offset = parsedOffset || DEFAULT_OFFSET;
    const validLimit = validateLimitAndOffsetRangeValues(limit, offset);
    if (!validLimit) {
        res.status(400).json({ error: "Invalid limit or offset" });
        return;
    }

    const skills: Skill[] = await getSkills(userid, limit, offset);
    res.status(200).json(skills);
});

export const getSkillController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const skillid = parseInt(req.params.id as string, 10);

    if (isNaN(skillid)) { res.status(400).json({error: "Invalid skill id"}); return; }

    const skill: Skill | null = await getSkill(userid, skillid);
    if (!skill) {
        res.status(404).json({error: "Skill not found"});
        return;
    }
    res.status(200).json(skill);
});

export const updateSkillController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const skillid = parseInt(req.params.id as string, 10);

    if (isNaN(skillid)) { res.status(400).json({ error: "Invalid skill id" }); return; }

    const validation = validateSkillBody(req, true);
    if (!validation.ok) { res.status(400).json({ error: validation.error }); return;}

    const existingSkill: Skill | null = await getSkill(userid, skillid);
    if (!existingSkill) { res.status(404).json({ error: "Skill not found" }); return; }

    const updatedSkill: Skill = {
        ...existingSkill,
        ...validation.data
    };
    
    const result = await updateSkill(updatedSkill);
    if (!result) { res.status(500).json({ error: "Failed to update skill" }); return; }
    
    res.status(200).json(updatedSkill);
});

export const deleteSkillController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const payload = req.user as JWTUserPayload;
    const userid = payload.user_id;
    const skillid = parseInt(req.params.id as string, 10);

    if (isNaN(skillid)) { res.status(400).json({error: "Invalid skill id"}); return; }
    if (isNaN(userid)) { res.status(400).json({error: "Invalid user id"}); return; }

    const existingSkill: Skill | null = await getSkill(userid, skillid);
    if (!existingSkill) {
        res.status(404).json({error: "Skill not found"});
        return;
    }
    const result = await deleteSkill(userid, skillid);
    if (!result) {
        res.status(500).json({error: "Failed to delete skill"});
        return;
    }

    res.status(200).json({message: "Skill deleted successfully"});
});

export const assignSkillToJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const validate = await validateSkillJobForAssignment(req);
    if (!validate.ok) {
        res.status(validate.status).json(validate.body);
        return;
    }
    const { jobid, skillid } = validate.data;
    const result = await assignSkillToJob(jobid, skillid);
    if (!result) {
        res.status(500).json({error: "Failed to assign skill to job"});
        return;
    }
    res.status(200).json({message: "Skill assigned to job successfully"});
});

export const removeSkillFromJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const validate = await validateSkillJobForAssignment(req);
    if (!validate.ok) {
        res.status(validate.status).json(validate.body);
        return;
    }
    const { jobid, skillid } = validate.data;
    const result = await removeSkillFromJob(jobid, skillid);
    if (!result) {
        res.status(500).json({error: "Failed to remove skill from job"});
        return;
    }
    res.status(200).json({message: "Skill removed from job successfully"});
});

export const getSkillsFromJobController = withErrorHandling(async (req: Request, res: Response): Promise<void> => {
    const jobid = parseInt(req.params.jobid as string, 10);

    if (isNaN(jobid)) { res.status(400).json({error: "Invalid job id"}); return; }

    const parsedLimit = parseInt(req.query.limit as string, 10);
    const parsedOffset = parseInt(req.query.offset as string, 10);
    const limit = parsedLimit || DEFAULT_LIMIT;
    const offset = parsedOffset || DEFAULT_OFFSET;
    const validLimit = validateLimitAndOffsetRangeValues(limit, offset);
    if (!validLimit) {
        res.status(400).json({error: "Invalid limit or offset"});
        return;
    }
    
    const skills: Skill[] = await getSkillsFromJob(jobid, limit, offset);
    res.status(200).json(skills);
});