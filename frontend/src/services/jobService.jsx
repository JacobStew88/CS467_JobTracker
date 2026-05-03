import request from "./apiClient";

// CREATE
export function createJob(jobData) {
  return request("/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  });
}

// READ
export function getJobs() {
  return request("/jobs");
}

// UPDATE
export function updateJob(id, updates) {
  return request(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// DELETE
export function deleteJob(id) {
  return request(`/jobs/${id}`, {
    method: "DELETE",
  });
}