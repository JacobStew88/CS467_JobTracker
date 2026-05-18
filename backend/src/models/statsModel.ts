import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db.js';

export interface JobStatusStats extends RowDataPacket {
  total_jobs: number;
  applied: number;
  waiting: number;
  interviewed: number;
  decision: number;
}

export interface SkillStats extends RowDataPacket {
  total_skills: number;
  average_comfort_level: number | null;
}

export interface DashboardStats {
  totalJobs: number;
  applied: number;
  waiting: number;
  interviewed: number;
  decision: number;
  totalSkills: number;
  averageComfortLevel: number | null;
}

export const getDashboardStats = async (
  userId: number
): Promise<DashboardStats> => {
   // Aggregate job counts by status for this user
    const [jobRows] = await pool.query<JobStatusStats[]>(
    `
      SELECT
        COUNT(*) AS total_jobs,
        SUM(CASE WHEN status = 'applied' THEN 1 ELSE 0 END) AS applied,
        SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) AS waiting,
        SUM(CASE WHEN status = 'interviewed' THEN 1 ELSE 0 END) AS interviewed,
        SUM(CASE WHEN status = 'decision' THEN 1 ELSE 0 END) AS decision
      FROM Jobs
      WHERE user_id = ?
    `,
    [userId]
  );

  // Skill totals and average confidence level
  const [skillRows] = await pool.query<SkillStats[]>(
    `
      SELECT
        COUNT(*) AS total_skills,
        AVG(comfort_level) AS average_comfort_level
      FROM Skills
      WHERE user_id = ?
    `,
    [userId]
  );

  const jobStats = jobRows[0];
  const skillStats = skillRows[0];

  return {
    totalJobs: Number(jobStats.total_jobs),
    applied: Number(jobStats.applied),
    waiting: Number(jobStats.waiting),
    interviewed: Number(jobStats.interviewed),
    decision: Number(jobStats.decision),
    totalSkills: Number(skillStats.total_skills),
    averageComfortLevel:
      skillStats.average_comfort_level === null
        ? null
        : Number(Number(skillStats.average_comfort_level).toFixed(2)),
  };
};