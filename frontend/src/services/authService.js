import { authHeaders } from "./apiClient";

const BASE_URL = "http://localhost:5000";

// LOGIN
export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Login failed");

  return data;
}

// account creation
export async function createAccount(email, username, password) {
  const res = await fetch("http://localhost:5000/auth/create-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }), // ✅ IMPORTANT
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Signup failed");
  }

  return res.json();
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