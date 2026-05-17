import request from "./apiClient";

// CREATE
export function createContact(data) {
  return request("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// GET ALL (supports limit + offset)
export function getContacts({ limit = 10, offset = 0 } = {}) {
  return request(`/contacts?limit=${limit}&offset=${offset}`);
}

// GET ONE
export function getContact(id) {
  return request(`/contacts/${id}`);
}

// UPDATE
export function updateContact(id, data) {
  return request(`/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE
export function deleteContact(id) {
  return request(`/contacts/${id}`, {
    method: "DELETE",
  });
}

export function getContactsFromJob(jobId) {
  return request(`/contacts/job/${jobId}`);
}

export function assignContactToJob(jobId, contactId, relationship_type) {
  return request(`/contacts/job/${jobId}/contact/${contactId}`, {
    method: "POST",
    body: JSON.stringify({ relationship_type }),
  });
}

export function removeContactFromJob(jobId, contactId) {
  return request(`/contacts/job/${jobId}/contact/${contactId}`, {
    method: "DELETE",
  });
}