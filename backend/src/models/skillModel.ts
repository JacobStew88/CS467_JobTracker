import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Skills Interface
export interface Skill extends RowDataPacket {
    skill_id: number; // PK
    user_id: number; // FK
    skill_name: string;
    comfort_level: number
};

const SKILLSTABLE: string = 'Skills'
const JOBSKILLSTABLE: string = 'JobSkills'

/* -- CRUD QUERIES FOR Skills: -- */
//Create a skill
export const createSkill = async (skill: Skill): Promise<Skill> => {
    const [content] = await pool.query<ResultSetHeader>(
        `INSERT INTO ${SKILLSTABLE} (user_id, skill_name, comfort_level) VALUES (?, ?, ?)`,
        [skill.user_id, skill.skill_name, skill.comfort_level]
    );
    return {...skill, skill_id: content.insertId}
}

// Get all skills for a user
export const getSkills = async (user_id: Skill['user_id']): Promise<Skill[]> => {
    const [content] = await pool.query<Skill[]>(
        `SELECT * FROM ${SKILLSTABLE} WHERE user_id = ?`,
        [user_id]
    );
    return content
}

// Get a specific skill
export const getSkill = async (user_id: Skill['user_id'], skill_id: Skill['skill_id']): Promise<Skill | null> => {
    const [content] = await pool.query<Skill[]>(
         `SELECT * FROM ${SKILLSTABLE} WHERE user_id = ? AND skill_id = ?`,
         [user_id, skill_id]
    );
    return content.length > 0 ? content[0] : null;
}

// Update a specific skill
export const updateSkill = async(skill: Skill): Promise<Boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `UPDATE ${SKILLSTABLE} SET skill_name = ?, comfort_level = ? WHERE user_id = ? and skill_id = ?`,
        [skill.skill_name, skill.comfort_level, skill.user_id, skill.skill_id]
    );
    return content.affectedRows > 0;
}

// Delete a specific skill
export const deleteSkill = async(user_id: Skill['user_id'], skill_id: Skill['skill_id']): Promise<Boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `DELETE FROM ${SKILLSTABLE} WHERE user_id = ? and skill_id = ?`,
        [user_id, skill_id]
    );
    return content.affectedRows > 0;
}

/* -- Creating the many to many link between skills and jobs: -- */
// Assign a skill to a job / job to a skill
export const assignSkillToJob = async(job_id: number, skill_id: Skill['skill_id']): Promise<boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `INSERT INTO ${JOBSKILLSTABLE} (job_id, skill_id) VALUES (?, ?)`,
        [job_id, skill_id]
    );
    return content.affectedRows > 0; 
}

// Remove a skill from a job / a job from a skill
export const removeSkillFromJob = async(job_id: number, skill_id: Skill['skill_id']): Promise<boolean> => {
    const [content] = await pool.query<ResultSetHeader>(
        `DELETE FROM ${JOBSKILLSTABLE} WHERE job_id = ? AND skill_id = ?`,
        [job_id, skill_id]
    );
    return content.affectedRows > 0; 
}

// Get all skills from a specific job
export const getSkillsFromJob = async(job_id: number): Promise<Skill[]> => {
    const [content] = await pool.query<Skill[]>(
        `SELECT s.* FROM ${SKILLSTABLE} s
        JOIN ${JOBSKILLSTABLE} js ON s.skill_id = js.skill_id
        WHERE js.job_id = ?`,
        [job_id]
    );
    return content;
}