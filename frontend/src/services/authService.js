import { authHeaders } from "./apiClient";

const BASE_URL = process.env.REACT_APP_API_URL;
console.log("BASE_URL =",BASE_URL);

// LOGIN
export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Invalid Creditional");

  return data;
}

// account creation
export async function createAccount(email, username, password) {
  const res = await fetch(`${BASE_URL}/auth/create-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Signup failed");
  }

  return data;
}

// PROTECTED ROUTE (keep it here, not separate file)
export async function getProtected() {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Not authorized");
  }

  return data;
}