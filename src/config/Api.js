export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export const getAuthHeaders = (additionalHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};
