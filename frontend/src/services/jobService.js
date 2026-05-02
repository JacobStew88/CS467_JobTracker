import { authHeaders } from "./apiClient";

const BASE_URL = "http://localhost:5000/jobs";

// CREATE
export async function createJob(jobData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(jobData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Create failed");
  return data;
}

// READ (ALL JOBS)
export async function getJobs() {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Fetch failed");
  return data;
}

// UPDATE
export async function updateJob(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
}

// DELETE
export async function deleteJob(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
}