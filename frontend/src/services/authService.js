import { authHeaders } from "./apiClient";

const BASE_URL = "http://localhost:5000";

// LOGIN
export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Login failed");

  return data;
}

// SIGNUP
export async function createAccount(email, password) {
  const res = await fetch(`${BASE_URL}/auth/create-account`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Signup failed");

  return data;
}

// PROTECTED ROUTE (keep it here, not separate file)
export async function getProtected() {
  const res = await fetch(`${BASE_URL}/protected`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Not authorized");

  return data;
}