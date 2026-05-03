import request from "./apiClient";

// LOGIN
export function loginUser(username, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// SIGNUP
export function createAccount(email, username, password) {
  return request("/auth/create-account", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
}

// PROTECTED
export function getProtected() {
  return request("/jobs");
}