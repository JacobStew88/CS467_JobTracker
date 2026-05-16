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

// FORGOT PASSWORD
export function forgotPassword(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// RESET PASSWORD
export function resetPassword(
  token,
  newPassword
) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      token,
      newPassword,
    }),
  });
}

// PROTECTED
export function getProtected() {
  return request("/jobs");
}