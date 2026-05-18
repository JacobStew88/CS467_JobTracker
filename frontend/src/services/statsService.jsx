import request from "./apiClient";

export function getDashboardStats() {
  return request("/stats");
}