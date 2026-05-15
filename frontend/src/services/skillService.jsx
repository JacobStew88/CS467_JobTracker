import request from "./apiClient";

// CREATE
export function createSkill(skillData) {
  return request("/skills", {
    method: "POST",
    body: JSON.stringify(skillData),
  });
}

// READ ALL
export function getSkills() {
  return request("/skills");
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

// FIXED ROUTE
export function getSkillsForJob(jobId) {
  return request(`/skills/jobs/${jobId}`);
}

// Assign
export function assignSkillToJob(skillId, jobId) {
  return request(`/skills/${skillId}/jobs/${jobId}`, {
    method: "POST",
  });
}

// Remove
export function removeSkillFromJob(skillId, jobId) {
  return request(`/skills/${skillId}/jobs/${jobId}`, {
    method: "DELETE",
  });
}
