import request from "./apiClient";

// CREATE
export function createSkill(skillData) {
  return request("/skills", {
    method: "POST",
    body: JSON.stringify(skillData),
  });
}

// READ ALL
export function getSkills({ limit = 10, offset = 0 } = {}) {
  return request(`/skills?limit=${limit}&offset=${offset}`);
}

// READ ONE
export function getSkill(id) {
  return request(`/skills/${id}`);
}

// UPDATE
export function updateSkill(id, updates) {
  return request(`/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// DELETE
export function deleteSkill(id) {
  return request(`/skills/${id}`, {
    method: "DELETE",
  });
}

// Get all skills assigned to a job
export function getSkillsForJob(jobId, { limit = 10, offset = 0 } = {}) {
  return request(`/jobs/${jobId}/skills?limit=${limit}&offset=${offset}`);
}

// Assign a skill to a job
export function assignSkillToJob(skillId, jobId) {
  return request(`/skills/${skillId}/jobs/${jobId}`, {
    method: "POST",
  });
}

// Remove a skill from a job
export function removeSkillFromJob(skillId, jobId) {
  return request(`/skills/${skillId}/jobs/${jobId}`, {
    method: "DELETE",
  });
}