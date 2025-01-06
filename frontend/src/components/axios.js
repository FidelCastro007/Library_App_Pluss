import axios from "axios";

// Create a custom Axios instance
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Your API URL
});

// Request Interceptor: Attach token to request if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
