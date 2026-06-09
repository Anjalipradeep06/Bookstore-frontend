import axios from "axios";

// 1. Create axios instance
const api = axios.create({
  baseURL: "https://bookstore-backend-dhlm.onrender.com",
});

// 2. REQUEST INTERCEPTOR
// Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR
// Handle global errors (like expired token)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token expired or invalid
    if (error.response?.status === 401) {
      console.log("Unauthorized - logging out");

      localStorage.removeItem("token");

      // optional redirect to Home page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;