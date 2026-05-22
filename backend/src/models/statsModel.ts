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

export interface SkillCoverageRow extends RowDataPacket {
  skill_name: string;
  comfort_level: number;
  jobs_with_skill: number;
  total_jobs: number;
}

export interface SkillCoverage {
  skillName: string;
  comfortLevel: number;
  jobsWithSkill: number;
  percentageOfJobs: number;
}

export interface DashboardStats {
  totalJobs: number;
  applied: number;
  waiting: number;
  interviewed: number;
  decision: number;
  totalSkills: number;
  averageComfortLevel: number | null;
  skillCoverage: SkillCoverage[];
}

export const getDashboardStats = async (
  userId: number
): Promise<DashboardStats> => {
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

  const [coverageRows] = await pool.query<SkillCoverageRow[]>(
    `
      SELECT
        Skills.skill_name,
        Skills.comfort_level,
        COUNT(JobSkills.job_id) AS jobs_with_skill,
        (
          SELECT COUNT(*)
          FROM Jobs
          WHERE Jobs.user_id = ?
        ) AS total_jobs
      FROM Skills
      LEFT JOIN JobSkills
        ON Skills.skill_id = JobSkills.skill_id
      WHERE Skills.user_id = ?
      GROUP BY Skills.skill_id
    `,
    [userId, userId]
  );

  const jobStats = jobRows[0];
  const skillStats = skillRows[0];

  const skillCoverage = coverageRows.map((row) => ({
    skillName: row.skill_name,
    comfortLevel: row.comfort_level,
    jobsWithSkill: Number(row.jobs_with_skill),
    percentageOfJobs:
      Number(row.total_jobs) === 0
        ? 0
        : Number(
            ((Number(row.jobs_with_skill) / Number(row.total_jobs)) * 100).toFixed(1)
          ),
  }));

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
    skillCoverage,
  };
};