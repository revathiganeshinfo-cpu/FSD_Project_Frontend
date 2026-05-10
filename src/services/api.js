import axios from "axios";

const API = axios.create({
  baseURL: "https://fsd-project-backend-n2dp.onrender.com"
});

API.interceptors.request.use((req) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    localStorage.removeItem("user");
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const message = error.response?.data?.message || "";

      if (message.includes("blocked")) {
        localStorage.removeItem("user");
        alert("Your account has been blocked. Contact admin.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (message.includes("Token") || message.includes("token") || message.includes("authorized")) {
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default API;