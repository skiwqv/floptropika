import axios from "axios";
const apiClient = axios.create({
  baseURL: "https://flopproject-1.onrender.com/",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access="))
      ?.split("=")[1];
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
